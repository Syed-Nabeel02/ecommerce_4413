package com.ecommerce.project.service;

import java.io.IOException;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.ecommerce.project.service.Interface.FileService;

import software.amazon.awssdk.auth.credentials.EnvironmentVariableCredentialsProvider;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

// Disabled in favor of CloudinaryServiceImpl
// @Service
// @Primary
public class S3FileServiceImpl implements FileService {

    private final S3Client s3Client;

    @Value("${aws.s3.bucket-name}")
    private String bucketName;

    @Value("${aws.region}")
    private String awsRegion;

    public S3FileServiceImpl() {
        this.s3Client = S3Client.builder()
                .region(Region.US_EAST_1) // Default, will be overridden by env variable
                .credentialsProvider(EnvironmentVariableCredentialsProvider.create())
                .build();
    }

    @Override
    public String uploadImage(String directoryPath, MultipartFile imageFile) throws IOException {
        String fileExtension = extractFileExtension(imageFile.getOriginalFilename());
        String generatedFileName = generateUniqueFileName(fileExtension);

        uploadToS3(generatedFileName, imageFile);

        return generatedFileName;
    }

    private String extractFileExtension(String sourceFileName) {
        return sourceFileName.substring(sourceFileName.lastIndexOf('.'));
    }

    private String generateUniqueFileName(String fileExtension) {
        String uniqueIdentifier = UUID.randomUUID().toString();
        return uniqueIdentifier.concat(fileExtension);
    }

    private void uploadToS3(String fileName, MultipartFile file) throws IOException {
        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(fileName)
                .contentType(file.getContentType())
                .build();

        s3Client.putObject(putObjectRequest,
                RequestBody.fromInputStream(file.getInputStream(), file.getSize()));
    }
}
