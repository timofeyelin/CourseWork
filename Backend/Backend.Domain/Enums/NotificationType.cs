namespace Backend.Domain.Enums
{
    public enum NotificationType
    {
        System = 0,         // Системное сообщение
        Request = 1,        // Изменение статуса заявки
        Bill = 2,           // Новая квитанция 
        Announcement = 3,   // Объявление 
        Debt = 4,           // Напоминание о задолженности
        Outage = 5          // Аварийное отключение
    }
}