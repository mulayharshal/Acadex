package com.acadex.common;

import lombok.Getter;

@Getter
public class ApiResponse<T> {

    private boolean success;
    private String message;
    private T data;

    // constructor for success
    public static <T> ApiResponse<T> success(String message, T data) {
        ApiResponse<T> response = new ApiResponse<>();
        response.success = true;
        response.message = message;
        response.data = data;
        return response;
    }

    // constructor for error
    public static <T> ApiResponse<T> error(String message) {
        ApiResponse<T> response = new ApiResponse<>();
        response.success = false;
        response.message = message;
        response.data = null;
        return response;
    }

}
