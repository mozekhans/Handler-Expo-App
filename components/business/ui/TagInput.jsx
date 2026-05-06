// src/components/ui/TagInput.jsx
import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const TagInput = ({
  tags,
  onTagsChange,
  placeholder,
  tagStyle = "default",
}) => {
  const [inputValue, setInputValue] = useState("");

  const addTag = () => {
    if (inputValue.trim() && !(tags || []).includes(inputValue.trim())) {
      onTagsChange([...(tags || []), inputValue.trim()]);

      setInputValue("");
    }
  };

  const removeTag = (tagToRemove) => {
    onTagsChange((tags || []).filter((tag) => tag !== tagToRemove));
  };

  const getTagStyle = () => {
    switch (tagStyle) {
      case "preferred":
        return styles.preferredTag;
      case "banned":
        return styles.bannedTag;
      default:
        return styles.defaultTag;
    }
  };

  const getTagTextStyle = () => {
    switch (tagStyle) {
      case "preferred":
        return styles.preferredTagText;
      case "banned":
        return styles.bannedTagText;
      default:
        return styles.defaultTagText;
    }
  };

  return (
    <View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputValue}
          onChangeText={setInputValue}
          placeholder={placeholder}
          onSubmitEditing={addTag}
          returnKeyType="done"
        />
        <TouchableOpacity style={styles.addButton} onPress={addTag}>
          <Ionicons name="add" size={24} color="#1976d2" />
        </TouchableOpacity>
      </View>

      <View style={styles.tagsContainer}>
        {(tags || []).map((tag, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.tag, getTagStyle()]}
            onPress={() => removeTag(tag)}
          >
            <Text style={[styles.tagText, getTagTextStyle()]}>{tag}</Text>
            <Ionicons
              name="close"
              size={16}
              color={
                tagStyle === "banned"
                  ? "#d32f2f"
                  : tagStyle === "preferred"
                    ? "#2e7d32"
                    : "#666"
              }
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    marginRight: 10,
    backgroundColor: "#fff",
  },
  addButton: {
    padding: 10,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  defaultTag: {
    backgroundColor: "#f5f5f5",
  },
  preferredTag: {
    backgroundColor: "#e8f5e9",
  },
  bannedTag: {
    backgroundColor: "#ffebee",
  },
  tagText: {
    fontSize: 14,
    marginRight: 5,
  },
  defaultTagText: {
    color: "#333",
  },
  preferredTagText: {
    color: "#2e7d32",
  },
  bannedTagText: {
    color: "#d32f2f",
  },
});

export default TagInput;
