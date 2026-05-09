import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import api from '../api';

const TaskFeed = ({ navigation }) => {
  const [batches, setBatches] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchBatches = async () => {
    try {
      const response = await api.get('/errands/batches');
      setBatches(response.data);
    } catch (err) {
      console.error('Failed to fetch batches');
    }
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchBatches();
    setRefreshing(false);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.taskCard}
      onPress={() => navigation.navigate('BatchDetail', { batchId: item.id })}
    >
      <View style={styles.header}>
        <Text style={styles.category}>{item.zone} Zone Batch</Text>
        <Text style={styles.price}>KES {item.total_estimated_price}</Text>
      </View>
      <Text style={styles.description}>Includes {item.errand_count} errands in this area.</Text>
      <View style={styles.locationContainer}>
        <Text style={styles.locationLabel}>Pickup Zone:</Text>
        <Text style={styles.locationText}>{item.zone}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Available Batches</Text>
      <FlatList
        data={batches}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>No batches available right now.</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16, color: '#333' },
  taskCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
  },
  header: { flexDirection: 'row', justifySpaceBetween: 'space-between', marginBottom: 8 },
  category: { fontSize: 16, fontWeight: 'bold', color: '#4F46E5' },
  price: { fontSize: 16, fontWeight: 'bold', color: '#10B981' },
  description: { fontSize: 14, color: '#666', marginBottom: 8 },
  locationContainer: { marginTop: 4 },
  locationLabel: { fontSize: 12, fontWeight: 'bold', color: '#999' },
  locationText: { fontSize: 14, color: '#333' },
  emptyText: { textAlign: 'center', marginTop: 40, color: '#999' },
});

export default TaskFeed;
