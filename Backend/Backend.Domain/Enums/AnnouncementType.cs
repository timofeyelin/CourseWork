namespace Backend.Domain.Enums
{
    public enum AnnouncementType
    {
        Info = 0,       // Обычная новость
        Outage = 1,     // Плановое отключение (Желтый)
        Emergency = 2   // Авария (Красный)
    }
}