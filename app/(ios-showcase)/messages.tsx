/**
 * iOS Messages Demo
 *
 * Replicates the iOS Messages app with:
 * - Conversation list with pinned contacts
 * - Glass pill buttons (Edit, Back)
 * - Unread blue dot indicators
 * - Bottom search bar with compose
 * - Individual chat view with proper keyboard handling
 * - iMessage-style bubbles with reactions
 */

import { useState, useRef, useCallback, useEffect } from "react";
import {
  View,
  ScrollView,
  FlatList,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TextInput,
  Dimensions,
} from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  SlideInRight,
  SlideOutRight,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Text, Avatar, Badge } from "@/components/ui";
import { GlassContainer } from "@/components/glass";
import { useTheme } from "@/hooks/useTheme";
import { useHaptics } from "@/hooks/useHaptics";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

// Pinned contacts data
const pinnedContacts = [
  { id: "p1", name: "Manijeh", avatar: null },
  { id: "p2", name: "Sara", avatar: null },
  { id: "p3", name: "Ava", avatar: null },
];

// Mock conversation data
const conversations = [
  {
    id: "1",
    name: "Andrew Mckeown",
    initials: "AM",
    lastMessage: "Hi. Got it. I'll check now",
    timestamp: "5:15 PM",
    unread: 0,
    hasPhoto: false,
  },
  {
    id: "2",
    name: "Kendall Sampson",
    initials: "KS",
    lastMessage: "Awesome! Thank you",
    timestamp: "5:15 PM",
    unread: 0,
    hasPhoto: false,
  },
  {
    id: "3",
    name: "Rania Chami",
    initials: null,
    lastMessage: "Hi. I'm working but yes. Just call me whenever",
    timestamp: "2:38 PM",
    unread: 0,
    hasPhoto: true,
  },
  {
    id: "4",
    name: "Fiona Basa-Reyes",
    initials: null,
    lastMessage: "If you're open to it, he and I can meet you for coffee Thursday m...",
    timestamp: "1:40 PM",
    unread: 1,
    hasPhoto: true,
  },
  {
    id: "5",
    name: "Fiona & Albie Rafa",
    initials: null,
    lastMessage: "We'll just have to coordinate to see you in OC then 😁",
    timestamp: "12:51 PM",
    unread: 1,
    hasPhoto: true,
    isGroup: true,
  },
  {
    id: "6",
    name: "Matt Santoro",
    initials: null,
    lastMessage: "Ok",
    timestamp: "12:08 PM",
    unread: 0,
    hasPhoto: true,
  },
];

// Mock messages for a chat
const mockMessages = [
  {
    id: "1",
    message: "Do you still have it or should we take over it?",
    isSent: true,
    timestamp: "11:20 AM",
    status: "read" as const,
  },
  {
    id: "2",
    message: "I need time to sort a couple personal things off it",
    isSent: false,
    timestamp: "11:22 AM",
    status: "read" as const,
  },
  {
    id: "3",
    message: "And I don't have it with me",
    isSent: false,
    timestamp: "11:22 AM",
    status: "read" as const,
  },
  {
    id: "4",
    message: "Please let me know when you have it so I can resend the code",
    isSent: true,
    timestamp: "11:25 AM",
    status: "delivered" as const,
  },
  {
    id: "5",
    message: "Ok",
    isSent: false,
    timestamp: "11:26 AM",
    status: "delivered" as const,
  },
];

/**
 * Glass Pill Button - iOS style pill-shaped glass button
 */
function GlassPillButton({
  onPress,
  children,
  badge,
}: {
  onPress: () => void;
  children: React.ReactNode;
  badge?: number;
}) {
  const { colors, isDark } = useTheme();
  const haptics = useHaptics();

  const handlePress = () => {
    haptics.light();
    onPress();
  };

  return (
    <Pressable onPress={handlePress}>
      <GlassContainer
        intensity="light"
        tint="surface"
        borderRadius="full"
        className="px-3 py-2"
      >
        <View className="flex-row items-center">
          {children}
          {badge !== undefined && badge > 0 && (
            <View
              className="ml-1 min-w-[18px] h-[18px] rounded-full items-center justify-center px-1"
              style={{ backgroundColor: colors.primary.DEFAULT }}
            >
              <Text
                variant="caption"
                style={{ color: "#FFFFFF", fontSize: 11, fontWeight: "600" }}
              >
                {badge > 99 ? "99+" : badge}
              </Text>
            </View>
          )}
        </View>
      </GlassContainer>
    </Pressable>
  );
}

/**
 * Pinned Contacts Row
 */
function PinnedContactsRow() {
  const haptics = useHaptics();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="py-3"
      contentContainerStyle={{ paddingHorizontal: 16 }}
    >
      {pinnedContacts.map((contact) => (
        <Pressable
          key={contact.id}
          onPress={() => haptics.light()}
          className="items-center mr-6"
        >
          <Avatar name={contact.name} size="xl" />
          <Text variant="caption" className="mt-1.5" numberOfLines={1}>
            {contact.name.split(" ")[0]}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

/**
 * Conversation List Item
 */
function ConversationItem({
  conversation,
  onPress,
}: {
  conversation: (typeof conversations)[0];
  onPress: () => void;
}) {
  const { colors } = useTheme();
  const haptics = useHaptics();

  const handlePress = () => {
    haptics.light();
    onPress();
  };

  const hasUnread = conversation.unread > 0;

  return (
    <Pressable
      onPress={handlePress}
      className="flex-row items-center py-3 px-4 bg-background active:bg-surface-elevated"
    >
      {/* Unread indicator */}
      <View className="w-3 mr-1">
        {hasUnread && (
          <View
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: colors.primary.DEFAULT }}
          />
        )}
      </View>

      {/* Avatar */}
      <View className="mr-3">
        {conversation.initials ? (
          <View
            className="w-12 h-12 rounded-full items-center justify-center"
            style={{ backgroundColor: "#6B7280" }}
          >
            <Text variant="label" style={{ color: "#FFFFFF" }}>
              {conversation.initials}
            </Text>
          </View>
        ) : (
          <Avatar name={conversation.name} size="lg" />
        )}
        {conversation.isGroup && (
          <View
            className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full items-center justify-center border-2 border-background"
            style={{ backgroundColor: colors.primary.DEFAULT }}
          >
            <Text variant="caption" style={{ color: "#FFFFFF", fontSize: 10 }}>
              A
            </Text>
          </View>
        )}
      </View>

      {/* Content */}
      <View className="flex-1">
        <View className="flex-row items-center justify-between">
          <Text
            variant="body"
            numberOfLines={1}
            className="flex-1 mr-2"
            style={{ fontWeight: hasUnread ? "600" : "400" }}
          >
            {conversation.name}
          </Text>
          <View className="flex-row items-center">
            <Text variant="caption" color="muted">
              {conversation.timestamp}
            </Text>
            <Ionicons
              name="chevron-forward"
              size={16}
              color={colors.foreground.muted}
              style={{ marginLeft: 4 }}
            />
          </View>
        </View>
        <Text
          variant="bodySmall"
          color="secondary"
          numberOfLines={2}
          className="mt-0.5 pr-4"
        >
          {conversation.lastMessage}
        </Text>
      </View>
    </Pressable>
  );
}

/**
 * Conversation List View
 */
function ConversationListView({
  onSelectConversation,
}: {
  onSelectConversation: (id: string) => void;
}) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const haptics = useHaptics();
  const [showFilter, setShowFilter] = useState(false);

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <GlassContainer
        intensity="light"
        tint="surface"
        borderRadius="none"
        style={{ paddingTop: insets.top }}
      >
        <View className="flex-row items-center justify-between px-4 py-2">
          {/* Edit Button */}
          <GlassPillButton onPress={() => haptics.light()}>
            <Text variant="body" color="default">
              Edit
            </Text>
          </GlassPillButton>

          {/* Title */}
          <Text variant="h5">Messages</Text>

          {/* Filter Button */}
          <GlassPillButton onPress={() => setShowFilter(!showFilter)}>
            <Ionicons
              name="options"
              size={20}
              color={colors.foreground.DEFAULT}
            />
          </GlassPillButton>
        </View>
      </GlassContainer>

      {/* Pinned Contacts */}
      <PinnedContactsRow />

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
        ItemSeparatorComponent={() => (
          <View className="h-px bg-border ml-[72px]" />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
      />

      {/* Bottom Search Bar */}
      <View
        className="absolute bottom-0 left-0 right-0"
        style={{ paddingBottom: insets.bottom }}
      >
        <GlassContainer intensity="medium" tint="surface" borderRadius="none">
          <View className="flex-row items-center px-4 py-2 gap-3">
            {/* Search Input */}
            <GlassContainer
              intensity="light"
              tint="surface"
              borderRadius="full"
              className="flex-1"
            >
              <View className="flex-row items-center px-3 py-2">
                <Ionicons
                  name="search"
                  size={18}
                  color={colors.foreground.muted}
                />
                <Text variant="body" color="muted" className="ml-2">
                  Search
                </Text>
              </View>
            </GlassContainer>

            {/* Microphone */}
            <Pressable onPress={() => haptics.light()}>
              <Ionicons
                name="mic-outline"
                size={24}
                color={colors.foreground.DEFAULT}
              />
            </Pressable>

            {/* Compose */}
            <Pressable onPress={() => haptics.light()}>
              <GlassContainer intensity="light" tint="surface" borderRadius="full">
                <View className="w-10 h-10 items-center justify-center">
                  <Ionicons
                    name="create-outline"
                    size={22}
                    color={colors.foreground.DEFAULT}
                  />
                </View>
              </GlassContainer>
            </Pressable>
          </View>
        </GlassContainer>
      </View>

      {/* Back to showcase */}
      <View
        className="absolute left-4"
        style={{ top: insets.top + 60 }}
      >
        <Pressable
          onPress={() => router.back()}
          className="opacity-50"
        >
          <Text variant="caption" color="primary">
            ← Back to Showcase
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

/**
 * Chat View
 */
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
  const inputRef = useRef<TextInput>(null);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<Array<{
    id: string;
    message: string;
    isSent: boolean;
    timestamp: string;
    status: "sending" | "sent" | "delivered" | "read";
  }>>(mockMessages);
  const [isTyping, setIsTyping] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const conversation = conversations.find((c) => c.id === conversationId);

  // Handle keyboard events
  const handleKeyboardShow = useCallback((e: any) => {
    setKeyboardHeight(e.endCoordinates.height);
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, []);

  const handleKeyboardHide = useCallback(() => {
    setKeyboardHeight(0);
  }, []);

  // Subscribe to keyboard events
  useEffect(() => {
    const showSub = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      handleKeyboardShow
    );
    const hideSub = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      handleKeyboardHide
    );

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [handleKeyboardShow, handleKeyboardHide]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      message: inputValue,
      isSent: true,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      }),
      status: "sending" as const,
    };

    setMessages([...messages, newMessage]);
    setInputValue("");
    haptics.light();

    // Scroll to bottom
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);

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
            timestamp: new Date().toLocaleTimeString([], {
              hour: "numeric",
              minute: "2-digit",
            }),
            status: "delivered" as const,
          },
        ]);
        haptics.light();
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }, 2000);
    }, 1000);
  };

  // Message bubble colors (iOS style)
  const sentBubbleColor = "#007AFF";
  const receivedBubbleColor = isDark ? "#3A3A3C" : "#E9E9EB";
  const sentTextColor = "#FFFFFF";
  const receivedTextColor = isDark ? "#FFFFFF" : "#000000";

  // Calculate border radius based on message grouping
  const getBubbleStyle = (
    isSent: boolean,
    isFirst: boolean,
    isLast: boolean
  ) => {
    const base = 18;
    const small = 4;

    if (isSent) {
      return {
        borderTopLeftRadius: base,
        borderTopRightRadius: isFirst ? base : small,
        borderBottomLeftRadius: base,
        borderBottomRightRadius: isLast ? base : small,
      };
    } else {
      return {
        borderTopLeftRadius: isFirst ? base : small,
        borderTopRightRadius: base,
        borderBottomLeftRadius: isLast ? base : small,
        borderBottomRightRadius: base,
      };
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={0}
      style={{ backgroundColor: isDark ? "#000000" : "#FFFFFF" }}
    >
      {/* Header */}
      <GlassContainer
        intensity="light"
        tint="surface"
        borderRadius="none"
        style={{ paddingTop: insets.top }}
      >
        <View className="flex-row items-center justify-between px-4 py-2">
          {/* Back Button with Glass Pill */}
          <GlassPillButton onPress={onBack} badge={2}>
            <Ionicons
              name="chevron-back"
              size={22}
              color={colors.foreground.DEFAULT}
            />
          </GlassPillButton>

          {/* Contact Info - Centered */}
          <Pressable
            onPress={() => haptics.light()}
            className="items-center absolute left-0 right-0"
            style={{ pointerEvents: "none" }}
          >
            <View style={{ pointerEvents: "auto" }} className="items-center">
              <Avatar name={conversation?.name || "User"} size="sm" />
              <Text variant="label" className="mt-0.5">
                {conversation?.name?.split(" ")[0]}
              </Text>
            </View>
          </Pressable>

          {/* Video Call Button */}
          <GlassPillButton onPress={() => haptics.light()}>
            <Ionicons
              name="videocam"
              size={20}
              color={colors.foreground.DEFAULT}
            />
          </GlassPillButton>
        </View>
      </GlassContainer>

      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        className="flex-1 px-3"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: 16,
          paddingBottom: 8,
        }}
        keyboardDismissMode="interactive"
        keyboardShouldPersistTaps="handled"
      >
        {messages.map((msg, index) => {
          const prevMsg = messages[index - 1];
          const nextMsg = messages[index + 1];
          const isFirstInGroup = !prevMsg || prevMsg.isSent !== msg.isSent;
          const isLastInGroup = !nextMsg || nextMsg.isSent !== msg.isSent;

          return (
            <View
              key={msg.id}
              className={`mb-0.5 ${msg.isSent ? "items-end" : "items-start"} ${
                isLastInGroup ? "mb-2" : ""
              }`}
            >
              <Pressable
                onLongPress={() => haptics.medium()}
                style={{
                  maxWidth: "75%",
                }}
              >
                <View
                  style={[
                    {
                      backgroundColor: msg.isSent
                        ? sentBubbleColor
                        : receivedBubbleColor,
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                    },
                    getBubbleStyle(msg.isSent, isFirstInGroup, isLastInGroup),
                  ]}
                >
                  <Text
                    variant="body"
                    style={{
                      color: msg.isSent ? sentTextColor : receivedTextColor,
                    }}
                  >
                    {msg.message}
                  </Text>
                </View>
              </Pressable>

              {/* Status for sent messages */}
              {msg.isSent && isLastInGroup && msg.status && (
                <Text variant="caption" color="muted" className="mt-1 mr-1">
                  {msg.status === "delivered"
                    ? "Delivered"
                    : msg.status === "read"
                    ? "Read"
                    : msg.status === "sending"
                    ? "Sending..."
                    : "Sent"}
                </Text>
              )}
            </View>
          );
        })}

        {/* Typing Indicator */}
        {isTyping && (
          <Animated.View
            entering={FadeIn}
            exiting={FadeOut}
            className="items-start mb-2"
          >
            <View
              style={{
                backgroundColor: receivedBubbleColor,
                paddingHorizontal: 16,
                paddingVertical: 12,
                borderRadius: 18,
              }}
            >
              <View className="flex-row gap-1">
                {[0, 1, 2].map((i) => (
                  <View
                    key={i}
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: colors.foreground.muted }}
                  />
                ))}
              </View>
            </View>
          </Animated.View>
        )}
      </ScrollView>

      {/* Input Bar */}
      <GlassContainer
        intensity="light"
        tint="surface"
        borderRadius="none"
        style={{ paddingBottom: Math.max(insets.bottom, 8) }}
      >
        <View className="flex-row items-end px-3 py-2 gap-2">
          {/* Plus/Attach Button */}
          <Pressable
            onPress={() => haptics.light()}
            className="w-9 h-9 items-center justify-center"
          >
            <Ionicons
              name="add-circle-outline"
              size={28}
              color={colors.foreground.muted}
            />
          </Pressable>

          {/* Text Input */}
          <View
            className="flex-1 flex-row items-end rounded-2xl px-3 py-2"
            style={{
              backgroundColor: isDark ? "#2C2C2E" : "#F2F2F7",
              minHeight: 36,
            }}
          >
            <TextInput
              ref={inputRef}
              value={inputValue}
              onChangeText={setInputValue}
              placeholder="iMessage"
              placeholderTextColor={colors.foreground.muted}
              multiline
              maxLength={2000}
              style={{
                flex: 1,
                fontSize: 16,
                lineHeight: 20,
                color: colors.foreground.DEFAULT,
                maxHeight: 100,
                paddingTop: 0,
                paddingBottom: 0,
              }}
            />
          </View>

          {/* Send or Mic Button */}
          {inputValue.trim().length > 0 ? (
            <Pressable
              onPress={handleSend}
              className="w-9 h-9 rounded-full items-center justify-center"
              style={{ backgroundColor: colors.primary.DEFAULT }}
            >
              <Ionicons name="arrow-up" size={22} color="#FFFFFF" />
            </Pressable>
          ) : (
            <Pressable
              onPress={() => haptics.light()}
              className="w-9 h-9 items-center justify-center"
            >
              <Ionicons
                name="mic-outline"
                size={26}
                color={colors.foreground.muted}
              />
            </Pressable>
          )}
        </View>
      </GlassContainer>
    </KeyboardAvoidingView>
  );
}

/**
 * Main Component
 */
export default function MessagesDemo() {
  const [selectedConversation, setSelectedConversation] = useState<
    string | null
  >(null);

  if (selectedConversation) {
    return (
      <ChatView
        conversationId={selectedConversation}
        onBack={() => setSelectedConversation(null)}
      />
    );
  }

  return (
    <ConversationListView onSelectConversation={setSelectedConversation} />
  );
}
