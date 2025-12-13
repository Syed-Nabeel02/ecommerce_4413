package com.ecommerce.project.service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.ecommerce.project.service.Interface.FileService;

@Service
public class FileServiceImpl implements FileService {

    @Override
    public String uploadImage(String directoryPath, MultipartFile imageFile) throws IOException {
        String fileExtension = extractFileExtension(imageFile.getOriginalFilename());
        String generatedFileName = generateUniqueFileName(fileExtension);
        String targetFilePath = buildFilePath(directoryPath, generatedFileName);

        ensureDirectoryExists(directoryPath);
        persistImageFile(imageFile, targetFilePath);

        return generatedFileName;
    }

    private String extractFileExtension(String sourceFileName) {
        return sourceFileName.substring(sourceFileName.lastIndexOf('.'));
    }

    private String generateUniqueFileName(String fileExtension) {
        String uniqueIdentifier = UUID.randomUUID().toString();
        return uniqueIdentifier.concat(fileExtension);
    }

    private String buildFilePath(String directoryPath, String generatedFileName) {
        return directoryPath + File.separator + generatedFileName;
    }

    private void ensureDirectoryExists(String directoryPath) {
        File directory = new File(directoryPath);
        if (!directory.exists()) {
            directory.mkdir();
        }
    }

    private void persistImageFile(MultipartFile imageFile, String targetFilePath) throws IOException {
        Files.copy(imageFile.getInputStream(), Paths.get(targetFilePath));
    }
}
