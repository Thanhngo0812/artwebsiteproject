package com.ct08team.artbackendproject.Service.Storage;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
// Xóa các import java.nio.file
// import java.io.IOException;
// ...

import java.util.Map;
import java.io.IOException; // Vẫn cần cho file.getBytes()

@Service
public class StorageService {

    // =======================================================
    // SỬA: Inject Cloudinary
    // =======================================================
    @Autowired
    private Cloudinary cloudinary;

    // (Xóa 'rootLocation' và constructor cũ)

    /**
     * SỬA: Tải file lên Cloudinary và trả về URL
     * @param file File được gửi từ React
     * @return URL công khai (secure_url) của file đã tải lên
     */
    public String uploadFile(MultipartFile file) {
        try {
            if (file.isEmpty()) {
                throw new RuntimeException("Failed to store empty file.");
            }

            // 1. Tải file lên Cloudinary
            // (Bạn có thể thêm các tùy chọn, ví dụ: "folder" -> "art_project")
            Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());

            // 2. Lấy URL an toàn (https)
            String url = (String) uploadResult.get("secure_url");
            if (url == null) {
                throw new RuntimeException("Lỗi upload: Cloudinary không trả về URL.");
            }

            return url; // Trả về URL

        } catch (IOException e) {
            throw new RuntimeException("Failed to store file.", e);
        }
    }

    // (Các hàm 'store' (lưu cục bộ) và 'getFileUrl' (lấy link localhost)
    // đã bị xóa vì chúng ta dùng uploadFile() mới)
}