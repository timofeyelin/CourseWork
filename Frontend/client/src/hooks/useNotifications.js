import { useCallback, useEffect, useMemo, useState } from 'react';
import { notificationsService } from '../api';

export const useNotifications = (enabled = true) => {
    const [items, setItems] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const load = useCallback(async () => {
        if (!enabled) return;
        setLoading(true);
        setError(null);

        try {
            // Бэкенд возвращает { unreadCount: number, items: [...] }
            const response = await notificationsService.getAll();
            const data = response?.data;

            if (data) {
                setItems(data.items || []);
                setUnreadCount(data.unreadCount || 0);
            }
        } catch (e) {
            console.error("Failed to load notifications", e);
            setError(e);
        } finally {
            setLoading(false);
        }
    }, [enabled]);

    useEffect(() => {
        load();
        
        // поллинг (авто-обновление) раз в минуту
        const interval = setInterval(load, 60000);
        return () => clearInterval(interval);
    }, [load]);

    const markAllAsRead = useCallback(async () => {
        // Оптимистичное обновление UI
        const prevItems = [...items];
        const prevCount = unreadCount;

        // Ставим всем isRead = true и сбрасываем счетчик
        setItems(prev => prev.map(n => ({ ...n, isRead: true })));
        setUnreadCount(0);

        try {
            await notificationsService.markAllAsRead();
        } catch (e) {
            // Если ошибка - откатываем назад
            console.error("Failed to mark as read", e);
            setItems(prevItems);
            setUnreadCount(prevCount);
            // Можно добавить вызов тоста с ошибкой здесь
        }
    }, [items, unreadCount]);

    const value = useMemo(() => ({
        items,
        unreadCount,
        loading,
        error,
        reload: load,
        markAllAsRead
    }), [items, unreadCount, loading, error, load, markAllAsRead]);

    return value;
};