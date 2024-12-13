using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using sample.Server.Models;
using sample.Server.Models.ViewModels;

namespace sample.Server.Area.Admin
{
    [Authorize(Roles = "Admin")]
    [Route("api/admin/[controller]")]
    [ApiController]
    public class UserController : Controller
    {
        private readonly UserManager<User> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        public UserController(UserManager<User> userManager, RoleManager<IdentityRole> roleManager)
        {
            _userManager = userManager;
            _roleManager = roleManager;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var users = await _userManager.Users.ToListAsync();
            return Ok(users);
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            var user = _userManager.FindByIdAsync(id);
            if (user == null)
                return NotFound();
            return Ok(user);
        }
        [HttpPost]
        public async Task<IActionResult> Create(UserViewModel viewModel)
        {
            var u = _userManager.FindByEmailAsync(viewModel.Email);
            // check email
            if (u != null)
                return BadRequest(new { Message = "Email Already Exist" });

            //check username
            u = _userManager.FindByNameAsync(viewModel.UserName);
            if (u != null)
                return BadRequest(new { Message = "Username Already Exist" });

            var user = new User { 
                UserName = viewModel.UserName, 
                PhoneNumber = viewModel.PhoneNumber,
                FirstName = viewModel.FirstName,
                LastName = viewModel.LastName,
                Email = viewModel.Email,
                EmailConfirmed = true,
                PhoneNumberConfirmed = true,
                TwoFactorEnabled = viewModel.TwoFactorEnabled
            };
            IdentityResult result = await _userManager.CreateAsync(user, viewModel.Password);
            if (result.Succeeded)
            {
                foreach (var item in viewModel.Roles)
                {
                    var role = await _roleManager.FindByNameAsync(item);
                    if (role == null)
                        await _roleManager.CreateAsync(new IdentityRole(item));
                }
                result = await _userManager.AddToRolesAsync(user, viewModel.Roles);
                if (result.Succeeded)
                {
                    return Ok(user);
                }
                else
                    return BadRequest();
            }
            else
                return BadRequest();


        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(string id, UserViewModel viewModel)
        {
            var user = await _userManager.FindByIdAsync(id.ToString());
            if (user == null)
                return NotFound();
            else
            {
                IdentityResult result;
                var recentRole = await _userManager.GetRolesAsync(user);
                var deleteRole = recentRole.Except(recentRole);
                var addRole = viewModel.Roles.Except(recentRole);
                result = await _userManager.RemoveFromRolesAsync(user, deleteRole);
                if (result.Succeeded)
                {
                    result = await _userManager.AddToRolesAsync(user, addRole);
                    if (result.Succeeded)
                    {
                        user.FirstName = viewModel.FirstName;
                        user.LastName = viewModel.LastName;
                        user.PasswordHash = viewModel.Password;
                        user.Email = viewModel.Email;
                        user.PhoneNumber = viewModel.PhoneNumber;
                        user.UserName = viewModel.PhoneNumber;
                        return Ok(await _userManager.UpdateAsync(user));
                    }
                    else
                        return BadRequest();
                }
                else
                    return BadRequest();
            }

        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var user = await _userManager.FindByIdAsync(id.ToString());
            if (user == null)
                return NotFound();
            else
            {
                await _userManager.DeleteAsync(user);
                return Ok();

            }

        }
    }
}
