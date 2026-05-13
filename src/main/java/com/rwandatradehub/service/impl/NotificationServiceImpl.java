package com.rwandatradehub.service.impl;

import com.rwandatradehub.dto.NotificationResponse;
import com.rwandatradehub.entity.Notification;
import com.rwandatradehub.entity.User;
import com.rwandatradehub.repository.NotificationRepository;
import com.rwandatradehub.repository.UserRepository;
import com.rwandatradehub.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    @Override
    public List<NotificationResponse> getMyNotifications(String email) {
        User user = getUser(email);
        return notificationRepository.findByRecipientOrderByCreatedAtDesc(user).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public long getUnreadCount(String email) {
        User user = getUser(email);
        return notificationRepository.countByRecipientAndReadFalse(user);
    }

    @Override
    @Transactional
    public void markRead(Long id, String email) {
        notificationRepository.findById(id).ifPresent(n -> {
            if (n.getRecipient().getEmail().equals(email)) {
                n.setRead(true);
                notificationRepository.save(n);
            }
        });
    }

    @Override
    @Transactional
    public void markAllRead(String email) {
        User user = getUser(email);
        notificationRepository.markAllReadForUser(user);
    }

    @Override
    public void create(User recipient, String title, String message, String type) {
        notificationRepository.save(Notification.builder()
                .recipient(recipient)
                .title(title)
                .message(message)
                .type(type)
                .build());
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));
    }

    private NotificationResponse toResponse(Notification n) {
        return NotificationResponse.builder()
                .id(n.getId())
                .title(n.getTitle())
                .message(n.getMessage())
                .type(n.getType())
                .read(n.isRead())
                .createdAt(n.getCreatedAt())
                .build();
    }
}
