package entity

type Client struct {
	ID           string `json:"id"`
	CompanyName  string `json:"company_name"`
	ContactName  string `json:"contact_name"`
	ContactTitle string `json:"contact_title,omitempty"`
	Email        string `json:"email"`
	Phone        string `json:"phone,omitempty"`
	Address      string `json:"address,omitempty"`
	Notes        string `json:"notes,omitempty"`
	IsActive     bool   `json:"is_active"`
	FreelancerId string `json:"freelancer_id,omitempty"`
}
