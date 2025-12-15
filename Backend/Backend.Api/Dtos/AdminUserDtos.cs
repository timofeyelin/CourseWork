namespace Backend.Api.Dtos
{
    public class AdminUserAccountDto
    {
        public int Id { get; set; }
        public string AccountNumber { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
    }

    public class AdminUserDto
    {
        public int Id { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public bool IsActive { get; set; }
        public List<AdminUserAccountDto> Accounts { get; set; } = new();
        
        public List<string> Addresses => Accounts.Select(a => a.Address).ToList();
        public List<string> AccountNumbers => Accounts.Select(a => a.AccountNumber).ToList();
    }

    public class BlockUserRequest
    {
        public int UserId { get; set; }
        public bool IsActive { get; set; }
    }

    public class ChangeRoleRequest
    {
        public int UserId { get; set; }
        public string NewRole { get; set; } = string.Empty;
    }
    
    public class AdminLinkAccountRequest
    {
        public int UserId { get; set; }
        public string AccountNumber { get; set; } = string.Empty;
    }

    public class AdminUnlinkAccountRequest
    {
        public int UserId { get; set; }
        public int AccountId { get; set; }
    }
}
