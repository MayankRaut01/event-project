package dto;

import javax.validation.constraints.NotBlank;

public class BookingRequestDto {

    @NotBlank(message = "Event name is required")
    private String eventName;

    @NotBlank(message = "Customer name is required")
    private String customerName;

	public String getEventName() {
		return eventName;
	}

	public void setEventName(String eventName) {
		this.eventName = eventName;
	}

	public String getCustomerName() {
		return customerName;
	}

	public void setCustomerName(String customerName) {
		this.customerName = customerName;
	}

    // Getters and Setters
}
