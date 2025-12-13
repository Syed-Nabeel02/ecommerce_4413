package com.ecommerce.project.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.ecommerce.project.service.Interface.FileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;

@Service
@Primary
public class CloudinaryServiceImpl implements FileService {

    @Autowired
    private Cloudinary cloudinary;

    @Override
    public String uploadImage(String folder, MultipartFile imageFile) throws IOException {
        // Generate unique filename
        String originalFilename = imageFile.getOriginalFilename();
        String fileExtension = extractFileExtension(originalFilename);
        String publicId = generateUniqueFileName(fileExtension);

        // Upload to Cloudinary
        Map<String, Object> uploadParams = ObjectUtils.asMap(
                "public_id", publicId,
                "folder", folder != null && !folder.isEmpty() ? folder : "products",
                "resource_type", "auto"
        );

        Map uploadResult = cloudinary.uploader().upload(imageFile.getBytes(), uploadParams);

        // Return the secure URL of the uploaded image
        return (String) uploadResult.get("secure_url");
    }

    private String extractFileExtension(String sourceFileName) {
        if (sourceFileName != null && sourceFileName.contains(".")) {
            return sourceFileName.substring(sourceFileName.lastIndexOf('.'));
        }
        return "";
    }

    private String generateUniqueFileName(String fileExtension) {
        String uniqueIdentifier = UUID.randomUUID().toString();
        // Remove the extension as Cloudinary handles it automatically
        return uniqueIdentifier;
    }
}