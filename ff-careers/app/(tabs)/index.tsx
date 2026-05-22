import { useState, useRef } from 'react';
import {
  Animated,
  LayoutAnimation,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  UIManager,
  useWindowDimensions,
  View,
} from 'react-native';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}
import AppHeader from '@/components/AppHeader';
import { AppColors, AppFonts } from '@/constants/theme';
import { useTasks } from '@/hooks/use-tasks';

const LISTS = ['To Do', 'List 2'];

/*const INITIAL_TASKS = [
  { id: '1', title: 'Review weekly goals', completed: false },
  { id: '2', title: 'Update resume bullet points', completed: true },
  { id: '3', title: 'Apply to one internship', completed: false },
];*/

export default function TodoScreen() {
  const [selectedList, setSelectedList] = useState(0);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [showCompleted, setShowCompleted] = useState(false);
  const chevronAnim = useRef(new Animated.Value(0)).current;
  const { tasks, loading, error, toggleTask, addTask } = useTasks();
  const { width } = useWindowDimensions();
  const isMobile = width < 600;

  const activeTasks = tasks.filter(t => t.status !== 'done');
  const completedTasks = tasks.filter(t => t.status === 'done');

  function handleToggleTask(id: number) {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    toggleTask(id);
  }

  function handleToggleCompleted() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    Animated.timing(chevronAnim, {
      toValue: showCompleted ? 0 : 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
    setShowCompleted(v => !v);
  }

  function handleAddTask() {
    if (!newTaskTitle.trim()) return;
    setNewTaskTitle('');
    setShowAddModal(false);
    addTask(newTaskTitle);
  }

  const chevronRotate = chevronAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] });

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader />
      <View style={styles.screen}>

        <View style={[styles.appContainer, isMobile && styles.appContainerMobile]}>
          {isMobile ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipBar} contentContainerStyle={styles.chipBarContent}>
              {LISTS.map((listName, index) => (
                <Pressable
                  key={listName}
                  onPress={() => setSelectedList(index)}
                  style={[styles.chip, index === selectedList && styles.chipActive]}>
                  <Text style={[styles.chipText, index === selectedList && styles.chipTextActive]}>{listName}</Text>
                </Pressable>
              ))}
              <Pressable style={styles.chip}>
                <Text style={styles.chipText}>+ Add a List</Text>
              </Pressable>
            </ScrollView>
          ) : (
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
          )}

          <View style={[styles.taskContainer, isMobile && styles.taskContainerMobile]}>
            <Text style={styles.sectionTitle}>{LISTS[selectedList]}</Text>

            {error && !loading && tasks.length > 0 && (
              <Text style={styles.stateTextError}>{error}</Text>
            )}

            <ScrollView
              contentContainerStyle={styles.taskList}
              showsVerticalScrollIndicator={false}>
              {loading ? (
                <Text style={styles.stateText}>Loading tasks...</Text>
              ) : tasks.length === 0 && error ? (
                <Text style={styles.stateTextError}>{error}</Text>
              ) : tasks.length === 0 ? (
                <Text style={styles.stateText}>No tasks yet — add one below.</Text>
              ) : (
                <>
                  {activeTasks.map((task) => (
                    <Pressable key={task.id} style={styles.task} onPress={() => { handleToggleTask(task.id); setShowRatingModal(true); }}>
                      <Text style={styles.circle}>○</Text>
                      <Text style={styles.taskTitle}>{task.title}</Text>
                    </Pressable>
                  ))}

                  {completedTasks.length > 0 && (
                    <>
                      <Pressable style={styles.completedHeader} onPress={handleToggleCompleted}>
                        <Animated.Text style={[styles.completedChevron, { transform: [{ rotate: chevronRotate }] }]}>›</Animated.Text>
                        <Text style={styles.completedHeaderText}>Completed ({completedTasks.length})</Text>
                      </Pressable>
                      {showCompleted && completedTasks.map((task) => (
                        <Pressable key={task.id} style={styles.task} onPress={() => handleToggleTask(task.id)}>
                          <Text style={[styles.circle, styles.circleComplete]}>●</Text>
                          <Text style={[styles.taskTitle, styles.taskTitleComplete]}>{task.title}</Text>
                        </Pressable>
                      ))}
                    </>
                  )}
                </>
              )}
            </ScrollView>

            {showAddModal ? (
              <View style={styles.addTaskButton}>
                <TextInput
                  style={styles.addTaskInput}
                  placeholder="Task title"
                  placeholderTextColor={AppColors.textMuted}
                  value={newTaskTitle}
                  onChangeText={setNewTaskTitle}
                  onSubmitEditing={handleAddTask}
                  onBlur={() => { setShowAddModal(false); setNewTaskTitle(''); }}
                  autoFocus
                  returnKeyType="done"
                />
              </View>
            ) : (
              <Pressable style={styles.addTaskButton} onPress={() => setShowAddModal(true)}>
                <Text style={styles.circle}>+</Text>
                <Text style={styles.addTaskText}>Add a task</Text>
              </Pressable>
            )}
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
  completedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 6,
  },
  completedChevron: {
    fontSize: 20,
    color: AppColors.textMuted,
    fontFamily: AppFonts.regular,
  },
  completedHeaderText: {
    fontSize: 16,
    color: AppColors.textMuted,
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
  stateText: {
    color: AppColors.textMuted,
    fontSize: 16,
    fontFamily: AppFonts.regular,
    textAlign: 'center',
    marginTop: 20,
  },
  stateTextError: {
    color: '#e74c3c',
    fontSize: 16,
    fontFamily: AppFonts.regular,
    textAlign: 'center',
    marginTop: 20,
  },
  modalInput: {
    width: '100%',
    backgroundColor: AppColors.surfaceMuted,
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    fontFamily: AppFonts.regular,
    color: AppColors.textPrimary,
    borderWidth: 1,
    borderColor: AppColors.accentBorder,
    marginTop: 12,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: AppColors.accentSoft,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: AppColors.textSecondary,
    fontFamily: AppFonts.regular,
  },
  addTaskInput: {
    flex: 1,
    fontSize: 18,
    fontFamily: AppFonts.regular,
    color: AppColors.textSecondary,
  },
  appContainerMobile: {
    flexDirection: 'column',
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 16,
  },
  chipBar: {
    flexShrink: 0,
    marginBottom: 12,
  },
  chipBarContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  chip: {
    backgroundColor: AppColors.accentSoft,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  chipActive: {
    backgroundColor: AppColors.surface,
    borderWidth: 2,
    borderColor: AppColors.accentBorder,
  },
  chipText: {
    fontSize: 15,
    color: AppColors.textSecondary,
    fontFamily: AppFonts.regular,
  },
  chipTextActive: {
    color: AppColors.textPrimary,
    fontFamily: AppFonts.bold,
  },
  taskContainerMobile: {
    borderRadius: 15,
    flex: 1,
  },
});
