import { useCallback, useEffect, useMemo, useState } from 'react';
import { notificationsService } from '../api';

export const useNotifications = (enabled = true) => {
    const [items, setItems] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [urgentUnreadCount, setUrgentUnreadCount] = useState(0);
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
                setUrgentUnreadCount(data.urgentUnreadCount || 0);
            }
        } catch (e) {
            console.error("Failed to load notifications", e);
            setError(e);
            setItems([]);
            setUnreadCount(0);
            setUrgentUnreadCount(0);
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
        const prevItems = [...items];
        const prevCount = unreadCount;
        const prevUrgent = urgentUnreadCount;

        // Ставим всем isRead = true и сбрасываем счетчик
        setItems(prev => prev.map(n => ({ ...n, isRead: true })));
        setUnreadCount(0);
        setUrgentUnreadCount(0);

        try {
            await notificationsService.markAllAsRead();
        } catch (e) {
            console.error("Failed to mark as read", e);
            setItems(prevItems);
            setUnreadCount(prevCount);
            setUrgentUnreadCount(prevUrgent);
        }
    }, [items, unreadCount, urgentUnreadCount]);

    const markAsRead = useCallback(async (notificationId) => {
        const prevItems = [...items];
        const prevCount = unreadCount;
        const prevUrgent = urgentUnreadCount;

        const target = items.find(n => n.notificationId === notificationId);
        if (!target || target.isRead) return;

        // оптимистично
        setItems(prev => prev.map(n => n.notificationId === notificationId ? { ...n, isRead: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));
        if (target.isUrgent) {
            setUrgentUnreadCount(prev => Math.max(0, prev - 1));
        }

        try {
            await notificationsService.markAsRead(notificationId);
        } catch (e) {
            console.error("Failed to mark notification as read", e);
            setItems(prevItems);
            setUnreadCount(prevCount);
            setUrgentUnreadCount(prevUrgent);
        }
    }, [items, unreadCount, urgentUnreadCount]);

    const value = useMemo(() => ({
        items,
        unreadCount,
        urgentUnreadCount,
        loading,
        error,
        reload: load,
        markAllAsRead,
        markAsRead,
    }), [items, unreadCount, urgentUnreadCount, loading, error, load, markAllAsRead, markAsRead]);

    return value;
};