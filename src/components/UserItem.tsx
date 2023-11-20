import { ListItem, CheckBox } from "@rneui/themed";
import React from "react";
import { Button, TouchableOpacity } from "react-native";

const UserItem = ({
  user,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  onNavigate,
}) => {
  return (
    <ListItem bottomDivider>
      <CheckBox
        checked={isSelected}
        onPress={(e) => {
          e.stopPropagation();
          onSelect(!isSelected);
        }}
      />
      <TouchableOpacity onPress={onNavigate} style={{ flex: 1 }}>
        <ListItem.Content>
          <ListItem.Title>{`${user.firstName} ${user.lastName}`}</ListItem.Title>
        </ListItem.Content>
      </TouchableOpacity>
      <Button
        title="Edit"
        onPress={(e) => {
          e.stopPropagation();
          onEdit();
        }}
      />
      <Button
        title="Delete"
        onPress={(e) => {
          e.stopPropagation();
          onDelete();
        }}
      />
    </ListItem>
  );
};

export default UserItem;
