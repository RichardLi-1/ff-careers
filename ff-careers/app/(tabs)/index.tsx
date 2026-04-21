import { useState } from 'react';
import {
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import AppHeader from '@/components/AppHeader';
import { AppColors, AppFonts } from '@/constants/theme';

const LISTS = ['To Do', 'List 2'];

const INITIAL_TASKS = [
  { id: '1', title: 'Review weekly goals', completed: false },
  { id: '2', title: 'Update resume bullet points', completed: true },
  { id: '3', title: 'Apply to one internship', completed: false },
];

export default function TodoScreen() {
  const [selectedList, setSelectedList] = useState(0);
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);

  const toggleTask = (taskId: string) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
    setShowRatingModal(true);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader />
      <View style={styles.screen}>

        <View style={styles.appContainer}>
          <View style={styles.sidebar}>
            {LISTS.map((listName, index) => (
              <Pressable
                key={listName}
                onPress={() => setSelectedList(index)}
                style={[
                  styles.listButton,
                  index === selectedList ? styles.listButtonActive : null,
                ]}>
                <Text style={styles.listButtonText}>{listName}</Text>
              </Pressable>
            ))}
            <Pressable style={styles.addListButton}>
              <Text style={styles.addListText}>+ Add a List</Text>
            </Pressable>
          </View>

          <View style={styles.taskContainer}>
            <Text style={styles.sectionTitle}>{LISTS[selectedList]}</Text>

            <ScrollView
              contentContainerStyle={styles.taskList}
              showsVerticalScrollIndicator={false}>
              {tasks.map((task) => (
                <Pressable key={task.id} style={styles.task} onPress={() => toggleTask(task.id)}>
                  <Text style={[styles.circle, task.completed ? styles.circleComplete : null]}>
                    {task.completed ? '●' : '○'}
                  </Text>
                  <Text style={[styles.taskTitle, task.completed ? styles.taskTitleComplete : null]}>
                    {task.title}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>

            <Pressable style={styles.addTaskButton}>
              <Text style={styles.circle}>+</Text>
              <Text style={styles.addTaskText}>Add a task</Text>
            </Pressable>
          </View>
        </View>
      </View>

      <Modal animationType="fade" transparent visible={showRatingModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>How much did you enjoy completing the task?</Text>
            <View style={styles.starRow}>
              {[1, 2, 3, 4, 5].map((value) => (
                <Pressable key={value} onPress={() => setSelectedRating(value)}>
                  <Text
                    style={[
                      styles.star,
                      selectedRating && value <= selectedRating ? styles.starActive : null,
                    ]}>
                    ★
                  </Text>
                </Pressable>
              ))}
            </View>
            <Pressable style={styles.submitButton} onPress={() => setShowRatingModal(false)}>
              <Text style={styles.submitButtonText}>Submit</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  screen: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
appContainer: {
    flexDirection: 'row',
    width: '100%',
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    alignSelf: 'center',
  },
  sidebar: {
    width: 200,
    flexDirection: 'column',
    gap: 10,
    marginRight: 20,
  },
  listButton: {
    backgroundColor: AppColors.accentSoft,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  listButtonActive: {
    backgroundColor: AppColors.surface,
    borderWidth: 2,
    borderColor: AppColors.accentBorder,
  },
  listButtonText: {
    fontSize: 18,
    textAlign: 'center',
    color: AppColors.textSecondary,
    fontFamily: AppFonts.bold,
  },
  addListButton: {
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  addListText: {
    color: AppColors.textMuted,
    fontSize: 16,
    textAlign: 'center',
    fontFamily: AppFonts.regular,
  },
  taskContainer: {
    flexGrow: 1,
    backgroundColor: AppColors.surfaceMuted,
    borderRadius: 15,
    padding: 20,
    flexDirection: 'column',
    minHeight: 400,
    position: 'relative',
  },
  sectionTitle: {
    fontSize: 24,
    color: AppColors.textPrimary,
    marginBottom: 14,
    fontFamily: AppFonts.bold,
  },
  taskList: {
    flexGrow: 1,
    paddingBottom: 60,
    flexDirection: 'column',
  },
  task: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: AppColors.accentSoft,
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    gap: 10,
  },
  circle: {
    fontSize: 20,
    color: AppColors.textSecondary,
    marginRight: 10,
    fontFamily: AppFonts.regular,
  },
  circleComplete: {
    color: AppColors.success,
  },
  taskTitle: {
    flexGrow: 1,
    textAlign: 'left',
    color: AppColors.textSecondary,
    fontSize: 18,
    fontFamily: AppFonts.regular,
  },
  taskTitleComplete: {
    textDecorationLine: 'line-through',
    color: AppColors.textMuted,
  },
  addTaskButton: {
    backgroundColor: AppColors.accentSoft,
    padding: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 'auto',
    width: '100%',
  },
  addTaskText: {
    fontSize: 18,
    color: AppColors.textSecondary,
    textAlign: 'left',
    fontFamily: AppFonts.regular,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: AppColors.overlay,
    zIndex: 1000,
  },
  modalCard: {
    backgroundColor: AppColors.surface,
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: AppColors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
    width: 300,
  },
  modalTitle: {
    textAlign: 'center',
    color: AppColors.textSecondary,
    fontSize: 18,
    fontFamily: AppFonts.regular,
  },
  starRow: {
    fontSize: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginVertical: 15,
  },
  star: {
    color: AppColors.textMuted,
    fontSize: 30,
    fontFamily: AppFonts.regular,
  },
  starActive: {
    color: 'gold',
  },
  submitButton: {
    backgroundColor: AppColors.accentBorder,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  submitButtonText: {
    fontSize: 16,
    color: AppColors.textSecondary,
    fontFamily: AppFonts.regular,
  },
});
