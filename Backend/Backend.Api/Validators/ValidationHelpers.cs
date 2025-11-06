using System.Text.RegularExpressions;

namespace Backend.Api.Validators
{
    public class ValidationHelpers
    {
        private const string PhonePattern = @"^\+?[1-9]\d{10,14}$";
        private const string EmailPattern = @"^[^\s@]+@[^\s@]+\.[^\s@]+$";

        public static bool IsValidPhone(string phone)
        {
            return Regex.IsMatch(phone, PhonePattern);
        }

        public static bool IsValidEmail(string email)
        {
            return Regex.IsMatch(email, EmailPattern);
        }

        public static bool IsValidEmailOrPhone(string value)
        {
            return IsValidEmail(value) || IsValidPhone(value);
        }
    }
}
