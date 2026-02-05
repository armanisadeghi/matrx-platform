/**
 * iOS Messages Demo
 *
 * Replicates the iOS Messages app with:
 * - Conversation list with avatars and previews
 * - Individual chat view with message bubbles
 * - Floating glass input bar
 * - Typing indicators and reactions
 */

import { useState, useRef } from "react";
import {
  View,
  ScrollView,
  FlatList,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Text, Avatar, Badge, Input } from "@/components/ui";
import { GlassContainer } from "@/components/glass";
import { HeaderLayout } from "@/components/layouts";
import {
  MessageBubble,
  MessageInput,
  TypingIndicator,
} from "@/components/ios";
import { useTheme } from "@/hooks/useTheme";
import { useHaptics } from "@/hooks/useHaptics";
import { cn } from "@/lib/utils";

// Mock conversation data
const conversations = [
  {
    id: "1",
    name: "John Appleseed",
    avatar: null,
    lastMessage: "Hey! Are you coming to the meeting today?",
    timestamp: "2:30 PM",
    unread: 2,
    isOnline: true,
  },
  {
    id: "2",
    name: "Sarah Wilson",
    avatar: null,
    lastMessage: "Thanks for the help! Really appreciated.",
    timestamp: "1:15 PM",
    unread: 0,
    isOnline: true,
  },
  {
    id: "3",
    name: "Design Team",
    avatar: null,
    lastMessage: "Mike: The new mockups look great!",
    timestamp: "12:45 PM",
    unread: 5,
    isOnline: false,
    isGroup: true,
  },
  {
    id: "4",
    name: "Mom",
    avatar: null,
    lastMessage: "Don't forget dinner on Sunday!",
    timestamp: "Yesterday",
    unread: 1,
    isOnline: false,
  },
  {
    id: "5",
    name: "Alex Chen",
    avatar: null,
    lastMessage: "The project files are ready for review.",
    timestamp: "Yesterday",
    unread: 0,
    isOnline: false,
  },
  {
    id: "6",
    name: "Family Group",
    avatar: null,
    lastMessage: "Dad: See you all next weekend!",
    timestamp: "Monday",
    unread: 0,
    isOnline: false,
    isGroup: true,
  },
];

// Mock messages for a chat
const mockMessages = [
  {
    id: "1",
    message: "Hey! Are you free for a call later?",
    isSent: false,
    timestamp: "2:15 PM",
    status: "read" as const,
  },
  {
    id: "2",
    message: "Yeah, I should be free around 4. What's up?",
    isSent: true,
    timestamp: "2:18 PM",
    status: "read" as const,
  },
  {
    id: "3",
    message: "I wanted to discuss the new project proposal. The client sent over some changes and I think we should go through them together.",
    isSent: false,
    timestamp: "2:20 PM",
    status: "read" as const,
  },
  {
    id: "4",
    message: "Sounds good! I'll review the docs before our call.",
    isSent: true,
    timestamp: "2:22 PM",
    status: "read" as const,
  },
  {
    id: "5",
    message: "Perfect, thanks!",
    isSent: false,
    timestamp: "2:23 PM",
    status: "read" as const,
    reactions: ["thumbsup"],
  },
  {
    id: "6",
    message: "By the way, did you see the design updates?",
    isSent: false,
    timestamp: "2:25 PM",
    status: "read" as const,
  },
  {
    id: "7",
    message: "Not yet, I'll check them out now",
    isSent: true,
    timestamp: "2:28 PM",
    status: "delivered" as const,
  },
  {
    id: "8",
    message: "Hey! Are you coming to the meeting today?",
    isSent: false,
    timestamp: "2:30 PM",
    status: "delivered" as const,
  },
];

interface ConversationItemProps {
  conversation: (typeof conversations)[0];
  onPress: () => void;
}

function ConversationItem({ conversation, onPress }: ConversationItemProps) {
  const { colors } = useTheme();
  const haptics = useHaptics();

  const handlePress = () => {
    haptics.light();
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      className="flex-row items-center py-3 px-4 bg-surface active:bg-surface-elevated"
    >
      {/* Avatar */}
      <View className="relative mr-3">
        <Avatar
          name={conversation.name}
          size="lg"
          showStatus={!conversation.isGroup}
          status={conversation.isOnline ? "online" : "offline"}
        />
        {conversation.isGroup && (
          <View className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-primary items-center justify-center">
            <Ionicons name="people" size={12} color="#FFFFFF" />
          </View>
        )}
      </View>

      {/* Content */}
      <View className="flex-1">
        <View className="flex-row items-center justify-between">
          <Text
            variant="label"
            numberOfLines={1}
            style={{ fontWeight: conversation.unread > 0 ? "600" : "400" }}
          >
            {conversation.name}
          </Text>
          <Text variant="caption" color="muted">
            {conversation.timestamp}
          </Text>
        </View>
        <View className="flex-row items-center justify-between mt-0.5">
          <Text
            variant="bodySmall"
            color={conversation.unread > 0 ? "default" : "secondary"}
            numberOfLines={1}
            className="flex-1 mr-2"
            style={{ fontWeight: conversation.unread > 0 ? "500" : "400" }}
          >
            {conversation.lastMessage}
          </Text>
          {conversation.unread > 0 && (
            <Badge variant="primary" size="sm" count={conversation.unread} />
          )}
        </View>
      </View>

      {/* Chevron */}
      <Ionicons
        name="chevron-forward"
        size={18}
        color={colors.foreground.muted}
        style={{ marginLeft: 8 }}
      />
    </Pressable>
  );
}

// Conversation List View
function ConversationListView({
  onSelectConversation,
}: {
  onSelectConversation: (id: string) => void;
}) {
  const { colors, isDark } = useTheme();
  const haptics = useHaptics();

  return (
    <HeaderLayout
      header={{
        title: "Messages",
        showBackButton: true,
        rightContent: (
          <Pressable
            onPress={() => haptics.light()}
            className="w-10 h-10 items-center justify-center"
          >
            <Ionicons name="create-outline" size={24} color={colors.primary.DEFAULT} />
          </Pressable>
        ),
      }}
      safeAreaEdges={["bottom"]}
    >
      {/* Search Bar */}
      <View className="px-4 pb-2">
        <View
          className="flex-row items-center rounded-xl px-3 py-2"
          style={{ backgroundColor: isDark ? colors.surface.elevated : "#E5E5EA" }}
        >
          <Ionicons name="search" size={18} color={colors.foreground.muted} />
          <Text variant="body" color="muted" className="ml-2">
            Search
          </Text>
        </View>
      </View>

      {/* Conversation List */}
      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ConversationItem
            conversation={item}
            onPress={() => onSelectConversation(item.id)}
          />
        )}
        ItemSeparatorComponent={() => <View className="h-px bg-border ml-[76px]" />}
        showsVerticalScrollIndicator={false}
      />
    </HeaderLayout>
  );
}

// Chat View
function ChatView({
  conversationId,
  onBack,
}: {
  conversationId: string;
  onBack: () => void;
}) {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const haptics = useHaptics();
  const scrollViewRef = useRef<ScrollView>(null);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState(mockMessages);
  const [isTyping, setIsTyping] = useState(false);

  const conversation = conversations.find((c) => c.id === conversationId);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      message: inputValue,
      isSent: true,
      timestamp: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
      status: "sending" as const,
    };

    setMessages([...messages, newMessage]);
    setInputValue("");
    haptics.light();

    // Simulate response
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            message: "Got it! I'll check and get back to you.",
            isSent: false,
            timestamp: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
            status: "delivered" as const,
          },
        ]);
        haptics.light();
      }, 2000);
    }, 1000);

    // Scroll to bottom
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={0}
    >
      {/* Header */}
      <GlassContainer
        intensity="light"
        tint="surface"
        borderRadius="none"
        style={{ paddingTop: insets.top }}
      >
        <View className="flex-row items-center justify-between px-4 py-3">
          {/* Back Button */}
          <Pressable
            onPress={() => {
              haptics.light();
              onBack();
            }}
            className="flex-row items-center"
          >
            <Ionicons name="chevron-back" size={28} color={colors.primary.DEFAULT} />
            {conversation?.unread ? (
              <Badge variant="primary" size="sm" count={conversation.unread} />
            ) : null}
          </Pressable>

          {/* Contact Info */}
          <Pressable
            onPress={() => haptics.light()}
            className="items-center flex-1 mx-4"
          >
            <Avatar name={conversation?.name || "User"} size="sm" />
            <Text variant="label" className="mt-1">
              {conversation?.name}
            </Text>
          </Pressable>

          {/* Actions */}
          <View className="flex-row items-center gap-4">
            <Pressable onPress={() => haptics.light()}>
              <Ionicons name="videocam" size={24} color={colors.primary.DEFAULT} />
            </Pressable>
            <Pressable onPress={() => haptics.light()}>
              <Ionicons name="call" size={22} color={colors.primary.DEFAULT} />
            </Pressable>
          </View>
        </View>
      </GlassContainer>

      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        className="flex-1 px-3"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 16, paddingBottom: 8 }}
      >
        {/* Date Header */}
        <View className="items-center mb-4">
          <View className="bg-surface-elevated px-3 py-1 rounded-full">
            <Text variant="caption" color="muted">
              Today
            </Text>
          </View>
        </View>

        {/* Messages */}
        {messages.map((msg, index) => {
          const prevMsg = messages[index - 1];
          const nextMsg = messages[index + 1];
          const isFirstInGroup = !prevMsg || prevMsg.isSent !== msg.isSent;
          const isLastInGroup = !nextMsg || nextMsg.isSent !== msg.isSent;

          return (
            <MessageBubble
              key={msg.id}
              message={msg.message}
              isSent={msg.isSent}
              timestamp={msg.timestamp}
              status={msg.status}
              senderName={!msg.isSent ? conversation?.name : undefined}
              showAvatar={!msg.isSent}
              isFirstInGroup={isFirstInGroup}
              isLastInGroup={isLastInGroup}
              reactions={msg.reactions}
              onLongPress={() => haptics.medium()}
            />
          );
        })}

        {/* Typing Indicator */}
        {isTyping && (
          <Animated.View entering={FadeIn} exiting={FadeOut}>
            <TypingIndicator name={conversation?.name} />
          </Animated.View>
        )}
      </ScrollView>

      {/* Input Bar */}
      <MessageInput
        value={inputValue}
        onChangeText={setInputValue}
        onSend={handleSend}
        placeholder="Message"
        style={{ paddingBottom: Math.max(insets.bottom, 8) }}
      />
    </KeyboardAvoidingView>
  );
}

// Main Component
export default function MessagesDemo() {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const router = useRouter();

  if (selectedConversation) {
    return (
      <ChatView
        conversationId={selectedConversation}
        onBack={() => setSelectedConversation(null)}
      />
    );
  }

  return (
    <ConversationListView
      onSelectConversation={setSelectedConversation}
    />
  );
}
