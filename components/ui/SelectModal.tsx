import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, Modal, FlatList, TouchableOpacity, TextInput, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';

interface SelectItem {
  id: number | string;
  name: string;
}

interface SelectModalProps {
  visible: boolean;
  title: string;
  items: SelectItem[];
  onClose: () => void;
  onSelect: (item: SelectItem) => void;
}

const SelectModal = ({ visible, title, items, onClose, onSelect }: SelectModalProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = useMemo(() => {
    if (!searchTerm) return items;
    return items.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [items, searchTerm]);

  const handleSelect = (item: SelectItem) => {
    onSelect(item);
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{title}</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={28} color={Colors.light.text} />
          </TouchableOpacity>
        </View>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#888" />
          <TextInput
            placeholder="Arayın..."
            style={styles.searchInput}
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
        </View>
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.itemContainer} onPress={() => handleSelect(item)}>
              <Text style={styles.itemText}>{item.name}</Text>
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => <View style={styles.divider} />}
        />
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.light.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    fontFamily: Fonts.family.bold,
    fontSize: Fonts.size.lg,
  },
  searchContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#fff', 
    borderRadius: 15, 
    padding: 16, 
    margin: 16
  },
  searchInput: { 
    flex: 1, 
    fontFamily: Fonts.family.regular, 
    fontSize: Fonts.size.md, 
    marginLeft: 12 
  },
  itemContainer: {
    paddingVertical: 18,
    paddingHorizontal: 24,
  },
  itemText: {
    fontFamily: Fonts.family.regular,
    fontSize: Fonts.size.md,
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginLeft: 24,
  },
});

export default SelectModal;
