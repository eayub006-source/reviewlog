from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from ..models import UserProfile, UserSettings


class RegisterSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(write_only=True)
    email = serializers.EmailField(required=True)

    class Meta:
        model = User
        fields = [
            "username",
            "email",
            "password",
            "confirm_password",
        ]
        extra_kwargs = {
            "password": {
                "write_only": True
            }
        }

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("An account with this email already exists.")
        return value

    def validate(self, attrs):
        if attrs["password"] != attrs["confirm_password"]:
            raise serializers.ValidationError(
                {
                    "password": "Passwords do not match."
                }
            )

        return attrs

    def create(self, validated_data):
        validated_data.pop("confirm_password")

        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
        )
        
        # Ensure related models exist
        UserProfile.objects.create(user=user)
        UserSettings.objects.create(user=user)

        return user


class UserProfileSerializer(serializers.ModelSerializer):
    bio = serializers.CharField(source='profile.bio', allow_blank=True, required=False)
    avatar_data = serializers.CharField(source='profile.avatar_data', allow_blank=True, required=False)

    # Settings
    language = serializers.CharField(source='settings.language', required=False)
    country = serializers.CharField(source='settings.country', required=False)
    timezone = serializers.CharField(source='settings.timezone', required=False)
    adult_content = serializers.BooleanField(source='settings.adult_content', required=False)
    filter_profanity = serializers.BooleanField(source='settings.filter_profanity', required=False)
    keyboard_shortcuts = serializers.BooleanField(source='settings.keyboard_shortcuts', required=False)

    class Meta:
        model = User
        fields = [
            "username",
            "email",
            "first_name",
            "last_name",
            "bio",
            "avatar_data",
            "language",
            "country",
            "timezone",
            "adult_content",
            "filter_profanity",
            "keyboard_shortcuts",
            "date_joined",
        ]
        read_only_fields = ["username", "date_joined"]

    def update(self, instance, validated_data):
        profile_data = validated_data.pop('profile', {})
        settings_data = validated_data.pop('settings', {})

        # Update User fields
        instance.email = validated_data.get('email', instance.email)
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.save()

        # Update or create Profile fields
        profile, _ = UserProfile.objects.get_or_create(user=instance)
        if 'bio' in profile_data:
            profile.bio = profile_data['bio']
        if 'avatar_data' in profile_data:
            profile.avatar_data = profile_data['avatar_data']
        profile.save()

        # Update or create Settings fields
        settings, _ = UserSettings.objects.get_or_create(user=instance)
        if 'language' in settings_data:
            settings.language = settings_data['language']
        if 'country' in settings_data:
            settings.country = settings_data['country']
        if 'timezone' in settings_data:
            settings.timezone = settings_data['timezone']
        if 'adult_content' in settings_data:
            settings.adult_content = settings_data['adult_content']
        if 'filter_profanity' in settings_data:
            settings.filter_profanity = settings_data['filter_profanity']
        if 'keyboard_shortcuts' in settings_data:
            settings.keyboard_shortcuts = settings_data['keyboard_shortcuts']
        settings.save()

        return instance


class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()


class PasswordResetConfirmSerializer(serializers.Serializer):
    uid = serializers.CharField()
    token = serializers.CharField()
    new_password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        if attrs["new_password"] != attrs["confirm_password"]:
            raise serializers.ValidationError({"new_password": "Passwords do not match."})
        validate_password(attrs["new_password"])
        return attrs
