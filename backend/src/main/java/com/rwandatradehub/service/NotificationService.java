package com.rwandatradehub.service;

import com.rwandatradehub.dto.NotificationResponse;
import com.rwandatradehub.entity.User;

import java.util.List;

public interface NotificationService {
    List<NotificationResponse> getMyNotifications(String email);
    long getUnreadCount(String email);
    void markRead(Long id, String email);
    void markAllRead(String email);
    void create(User recipient, String title, String message, String type);
}
