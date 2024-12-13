using System.ComponentModel.DataAnnotations;

namespace test.Server.Models.ViewModels
{
    public class RigesterViewModel
    {

        public string? FirstName { get; set; }
        public string? LastName { get; set; }

        [Required(ErrorMessage = "User Name is required")]
        public string? Username { get; set; }

        [EmailAddress]
        [Required(ErrorMessage = "Email is required")]
        public string? Email { get; set; }

        [Required(ErrorMessage = "Password is required")]
        public string? Password { get; set; }
        [Compare("Password", ErrorMessage = "the Password & ConfirmPassword doen,t match")]
        public string ConfirmPassword { get; set; }
    }
    public class LoginViewModel
    {
        [Required(ErrorMessage = "User Name is required")]
        public string? Username { get; set; }

        [Required(ErrorMessage = "Password is required")]
        public string? Password { get; set; }
    }
}
