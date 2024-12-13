using sample.Server.Models.ViewModels;

namespace sample.Server.services
{
    public interface IEmailService
    {
        void SendEmail(MessageViewModel message);
    }
}