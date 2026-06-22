package com.acadex.config;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class FileStorageService {

    private final String uploadDir = "uploads" + File.separator + "notes" + File.separator;

    public String saveFile(MultipartFile file)throws IOException {
        File di=new File(uploadDir);
        if(!di.exists()){
            di.mkdirs();
        }
        String fileName=System.currentTimeMillis()+"."+file.getOriginalFilename();
        Path filePath = Paths.get(uploadDir+fileName);
        Files.copy(file.getInputStream(),filePath);

        return filePath.toString();
    }
}
