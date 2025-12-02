"""JSON-based storage for conversations."""

import json
import os
from datetime import datetime
from typing import List, Dict, Any, Optional
from pathlib import Path
from .config import DATA_DIR

# User profiles directory
PROFILES_DIR = os.path.join(os.path.dirname(DATA_DIR), "data", "profiles")

# Subscriptions directory
SUBSCRIPTIONS_DIR = os.path.join(os.path.dirname(DATA_DIR), "data", "subscriptions")


def ensure_data_dir():
    """Ensure the data directory exists."""
    Path(DATA_DIR).mkdir(parents=True, exist_ok=True)
    Path(PROFILES_DIR).mkdir(parents=True, exist_ok=True)
    Path(SUBSCRIPTIONS_DIR).mkdir(parents=True, exist_ok=True)


def get_conversation_path(conversation_id: str) -> str:
    """Get the file path for a conversation."""
    return os.path.join(DATA_DIR, f"{conversation_id}.json")


def create_conversation(
    conversation_id: str,
    user_id: str,
    subscription_tier: str = "free"
) -> Dict[str, Any]:
    """
    Create a new conversation.

    Args:
        conversation_id: Unique identifier for the conversation
        user_id: Clerk user ID who owns this conversation
        subscription_tier: User's subscription tier (affects expiration)

    Returns:
        New conversation dict
    """
    ensure_data_dir()

    conversation = {
        "id": conversation_id,
        "user_id": user_id,  # Feature 4: Associate conversation with user
        "created_at": datetime.utcnow().isoformat(),
        "title": "New Conversation",
        "starred": False,
        "messages": [],
        # Feature 3: Report cycle tracking for freemium model
        # Tracks which report cycle we're on (1st question, 2nd with follow-up)
        "report_cycle": 0,  # 0 = initial, 1 = after first report, 2 = after follow-up
        # Whether user has submitted follow-up answers for current report
        "has_follow_up": False,
        # Stores the user's answers to follow-up questions
        "follow_up_answers": None,
        # Feature 5: Report expiration for free users
        "is_visible": True,
        "expires_at": None  # Will be set after first message for free users
    }

    # Free users: set 7-day expiration after creation
    if subscription_tier == "free":
        from datetime import timedelta
        expires = datetime.utcnow() + timedelta(days=7)
        conversation["expires_at"] = expires.isoformat()

    # Save to file
    path = get_conversation_path(conversation_id)
    with open(path, 'w') as f:
        json.dump(conversation, f, indent=2)

    return conversation


def get_conversation(conversation_id: str) -> Optional[Dict[str, Any]]:
    """
    Load a conversation from storage.

    Args:
        conversation_id: Unique identifier for the conversation

    Returns:
        Conversation dict or None if not found
    """
    path = get_conversation_path(conversation_id)

    if not os.path.exists(path):
        return None

    with open(path, 'r') as f:
        return json.load(f)


def save_conversation(conversation: Dict[str, Any]):
    """
    Save a conversation to storage.

    Args:
        conversation: Conversation dict to save
    """
    ensure_data_dir()

    path = get_conversation_path(conversation['id'])
    with open(path, 'w') as f:
        json.dump(conversation, f, indent=2)


def list_conversations(user_id: Optional[str] = None) -> List[Dict[str, Any]]:
    """
    List all conversations (metadata only), optionally filtered by user.

    Args:
        user_id: Optional Clerk user ID to filter conversations

    Returns:
        List of conversation metadata dicts
    """
    ensure_data_dir()

    conversations = []
    for filename in os.listdir(DATA_DIR):
        if filename.endswith('.json'):
            path = os.path.join(DATA_DIR, filename)
            with open(path, 'r') as f:
                data = json.load(f)

                # Filter by user_id if provided
                if user_id and data.get("user_id") != user_id:
                    continue

                # Return metadata only
                conversations.append({
                    "id": data["id"],
                    "created_at": data["created_at"],
                    "title": data.get("title", "New Conversation"),
                    "starred": data.get("starred", False),
                    "message_count": len(data["messages"]),
                    "expires_at": data.get("expires_at"),  # Feature 5
                    "is_visible": data.get("is_visible", True)  # Feature 5
                })

    # Sort by creation time, newest first
    conversations.sort(key=lambda x: x["created_at"], reverse=True)

    return conversations


def add_user_message(conversation_id: str, content: str):
    """
    Add a user message to a conversation.

    Args:
        conversation_id: Conversation identifier
        content: User message content
    """
    conversation = get_conversation(conversation_id)
    if conversation is None:
        raise ValueError(f"Conversation {conversation_id} not found")

    conversation["messages"].append({
        "role": "user",
        "content": content
    })

    save_conversation(conversation)


def add_assistant_message(
    conversation_id: str,
    stage1: List[Dict[str, Any]],
    stage2: List[Dict[str, Any]],
    stage3: Dict[str, Any]
):
    """
    Add an assistant message with all 3 stages to a conversation.

    Args:
        conversation_id: Conversation identifier
        stage1: List of individual model responses
        stage2: List of model rankings
        stage3: Final synthesized response
    """
    conversation = get_conversation(conversation_id)
    if conversation is None:
        raise ValueError(f"Conversation {conversation_id} not found")

    conversation["messages"].append({
        "role": "assistant",
        "stage1": stage1,
        "stage2": stage2,
        "stage3": stage3
    })

    save_conversation(conversation)


def update_conversation(conversation_id: str, updates: Dict[str, Any]):
    """
    Update conversation fields.

    Args:
        conversation_id: Conversation identifier
        updates: Dict of fields to update

    Raises:
        ValueError: If conversation not found
    """
    conversation = get_conversation(conversation_id)
    if conversation is None:
        raise ValueError(f"Conversation {conversation_id} not found")

    conversation.update(updates)
    save_conversation(conversation)


def update_conversation_title(conversation_id: str, title: str):
    """
    Update the title of a conversation.

    Args:
        conversation_id: Conversation identifier
        title: New title for the conversation
    """
    update_conversation(conversation_id, {"title": title})


def toggle_conversation_starred(conversation_id: str) -> bool:
    """
    Toggle the starred status of a conversation.

    Args:
        conversation_id: Conversation identifier

    Returns:
        New starred status (True/False)
    """
    conversation = get_conversation(conversation_id)
    if conversation is None:
        raise ValueError(f"Conversation {conversation_id} not found")

    conversation["starred"] = not conversation.get("starred", False)
    save_conversation(conversation)
    return conversation["starred"]


def delete_conversation(conversation_id: str):
    """
    Delete a conversation.

    Args:
        conversation_id: Conversation identifier
    """
    path = get_conversation_path(conversation_id)
    if os.path.exists(path):
        os.remove(path)


def save_follow_up_answers(conversation_id: str, follow_up_answers: str):
    """
    Save follow-up answers to a conversation for Feature 3.

    This enables the second report generation with additional context.
    After saving, the conversation is marked as having follow-up data,
    which will be injected into the next council deliberation.

    Args:
        conversation_id: Conversation identifier
        follow_up_answers: User's answers to follow-up questions

    Raises:
        ValueError: If conversation not found
    """
    conversation = get_conversation(conversation_id)
    if conversation is None:
        raise ValueError(f"Conversation {conversation_id} not found")

    # Store the follow-up answers
    conversation["follow_up_answers"] = follow_up_answers
    conversation["has_follow_up"] = True

    # Increment report cycle: 0 → 1 (after first report), 1 → 2 (after follow-up)
    conversation["report_cycle"] = conversation.get("report_cycle", 0) + 1

    save_conversation(conversation)


# User Profile Functions


def get_profile_path(user_id: str) -> str:
    """Get the file path for a user profile."""
    return os.path.join(PROFILES_DIR, f"{user_id}.json")


def create_user_profile(user_id: str, email: Optional[str], profile_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Create a new user profile.

    Args:
        user_id: Clerk user ID
        email: User's email address (optional)
        profile_data: Profile data (gender, age_range, mood)

    Returns:
        Created profile dict
    """
    ensure_data_dir()

    profile = {
        "user_id": user_id,
        "email": email or "unknown@clerk.local",
        "profile": {
            "gender": profile_data.get("gender"),
            "age_range": profile_data.get("age_range"),
            "mood": profile_data.get("mood")
        },
        "created_at": datetime.utcnow().isoformat(),
        "profile_locked": True  # Cannot edit after creation (per spec)
    }

    path = get_profile_path(user_id)
    with open(path, 'w') as f:
        json.dump(profile, f, indent=2)

    return profile


def get_user_profile(user_id: str) -> Optional[Dict[str, Any]]:
    """
    Load a user profile from storage.

    Args:
        user_id: Clerk user ID

    Returns:
        Profile dict or None if not found
    """
    path = get_profile_path(user_id)

    if not os.path.exists(path):
        return None

    with open(path, 'r') as f:
        return json.load(f)


def update_user_profile(user_id: str, profile_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Update a user profile (only if not locked).

    Args:
        user_id: Clerk user ID
        profile_data: Updated profile data

    Returns:
        Updated profile dict

    Raises:
        ValueError: If profile is locked or not found
    """
    profile = get_user_profile(user_id)
    if profile is None:
        raise ValueError(f"Profile for user {user_id} not found")

    if profile.get("profile_locked", False):
        raise ValueError("Profile is locked and cannot be edited")

    # Update profile fields
    profile["profile"].update(profile_data)

    path = get_profile_path(user_id)
    with open(path, 'w') as f:
        json.dump(profile, f, indent=2)

    return profile


# Subscription Functions (Feature 4)


def get_subscription_path(user_id: str) -> str:
    """Get the file path for a user subscription."""
    return os.path.join(SUBSCRIPTIONS_DIR, f"{user_id}.json")


def create_subscription(user_id: str, tier: str = "free") -> Dict[str, Any]:
    """
    Create a new subscription for a user.

    Args:
        user_id: Clerk user ID
        tier: Subscription tier (free, single_report, monthly, yearly)

    Returns:
        Created subscription dict
    """
    ensure_data_dir()

    subscription = {
        "user_id": user_id,
        "tier": tier,
        "status": "active",
        "stripe_subscription_id": None,
        "current_period_end": None,
        "created_at": datetime.utcnow().isoformat(),
        "updated_at": datetime.utcnow().isoformat()
    }

    path = get_subscription_path(user_id)
    with open(path, 'w') as f:
        json.dump(subscription, f, indent=2)

    return subscription


def get_subscription(user_id: str) -> Optional[Dict[str, Any]]:
    """
    Load a user subscription from storage.

    Args:
        user_id: Clerk user ID

    Returns:
        Subscription dict or None if not found
    """
    path = get_subscription_path(user_id)

    if not os.path.exists(path):
        return None

    with open(path, 'r') as f:
        return json.load(f)


def update_subscription(user_id: str, data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Update a user subscription.

    Args:
        user_id: Clerk user ID
        data: Fields to update

    Returns:
        Updated subscription dict

    Raises:
        ValueError: If subscription not found
    """
    subscription = get_subscription(user_id)
    if subscription is None:
        raise ValueError(f"Subscription for user {user_id} not found")

    # Update fields
    subscription.update(data)
    subscription["updated_at"] = datetime.utcnow().isoformat()

    path = get_subscription_path(user_id)
    with open(path, 'w') as f:
        json.dump(subscription, f, indent=2)

    return subscription


def update_subscription_by_stripe_id(
    stripe_subscription_id: str,
    data: Dict[str, Any]
) -> Optional[Dict[str, Any]]:
    """
    Update subscription by Stripe subscription ID.

    This is useful for webhook handlers that only have the Stripe ID.

    Args:
        stripe_subscription_id: Stripe subscription ID
        data: Fields to update

    Returns:
        Updated subscription dict or None if not found
    """
    ensure_data_dir()

    # Search all subscriptions for matching Stripe ID
    for filename in os.listdir(SUBSCRIPTIONS_DIR):
        if filename.endswith('.json'):
            path = os.path.join(SUBSCRIPTIONS_DIR, filename)
            with open(path, 'r') as f:
                subscription = json.load(f)

                if subscription.get("stripe_subscription_id") == stripe_subscription_id:
                    # Found it! Update and return
                    subscription.update(data)
                    subscription["updated_at"] = datetime.utcnow().isoformat()

                    with open(path, 'w') as f:
                        json.dump(subscription, f, indent=2)

                    return subscription

    return None


def restore_all_expired_reports(user_id: str):
    """
    Restore all expired reports for a user (auto-restore on subscription).

    This is called when a user subscribes to automatically restore access
    to all their previously expired reports.

    Args:
        user_id: Clerk user ID
    """
    ensure_data_dir()

    # Find all conversations for this user
    for filename in os.listdir(DATA_DIR):
        if filename.endswith('.json'):
            path = os.path.join(DATA_DIR, filename)
            with open(path, 'r') as f:
                conversation = json.load(f)

                # Skip if not owned by this user
                if conversation.get("user_id") != user_id:
                    continue

                # Restore if expired or has expiration set
                if conversation.get("expires_at") or not conversation.get("is_visible", True):
                    conversation["is_visible"] = True
                    conversation["expires_at"] = None  # Remove expiration for paid users

                    with open(path, 'w') as f:
                        json.dump(conversation, f, indent=2)
