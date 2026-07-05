package com.acadex.config;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.Map;

@Service
public class CloudinaryService {

    @Autowired
    private Cloudinary cloudinary;

    public String uploadFile(MultipartFile file, String folder) throws IOException {

        Map<?, ?> uploadResult = cloudinary.uploader().upload(
                file.getBytes(),
                ObjectUtils.asMap(
                        "folder", folder,
                        "resource_type", "auto"
                )
        );

        return uploadResult.get("secure_url").toString();
    }

    public String uploadRawFile(MultipartFile file, String folder) throws IOException {

        File tempFile = File.createTempFile("upload-", "-" + file.getOriginalFilename());
        file.transferTo(tempFile);

        Map<?, ?> uploadResult = cloudinary.uploader().upload(
                tempFile,
                ObjectUtils.asMap(
                        "folder", folder,
                        "resource_type", "raw",
                        "use_filename", true,
                        "unique_filename", true
                )
        );

        tempFile.delete();

        return uploadResult.get("secure_url").toString();
    }

}