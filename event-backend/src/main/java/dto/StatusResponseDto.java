package dto;

public class StatusResponseDto {
    private String status;
    private String message;

    // No-args constructor
    public StatusResponseDto() {
    }

    // Constructor with status only
    public StatusResponseDto(String status) {
        this.status = status;
    }

    // Constructor with both status and message
    public StatusResponseDto(String status, String message) {
        this.status = status;
        this.message = message;
    }

    // Getters and Setters
    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    // Optional: toString() method for better logging/debugging
    @Override
    public String toString() {
        return "StatusResponseDto{" +
                "status='" + status + '\'' +
                ", message='" + message + '\'' +
                '}';
    }
}