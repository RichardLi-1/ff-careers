import { useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

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
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning,';
    if (hour < 18) return 'Good Afternoon,';
    return 'Good Evening,';
  }, []);

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
      <View style={styles.screen}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoText}>FF</Text>
            </View>
            <View style={styles.greetingContainer}>
              <Text style={styles.greeting}>{greeting}</Text>
              <Text style={styles.name}>Loading...</Text>
            </View>
          </View>

          <View style={styles.navContainer}>
            <View style={styles.navRow}>
              <Pressable style={styles.navButton}>
                <Text style={[styles.navText, styles.navTextActive]}>To Do</Text>
              </Pressable>
              <Pressable style={styles.navButton}>
                <Text style={styles.navText}>Career Library</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.settingsWrap}>
            <Pressable
              onPress={() => setShowSettingsMenu((current) => !current)}
              style={styles.settingsButton}>
              <Text style={styles.settingsButtonText}>⚙</Text>
            </Pressable>
            {showSettingsMenu ? (
              <View style={styles.settingsMenu}>
                <Pressable style={styles.menuButton}>
                  <Text style={styles.menuButtonText}>Log Out</Text>
                </Pressable>
              </View>
            ) : null}
          </View>
        </View>

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
    backgroundColor: '#f5f6f8',
  },
  screen: {
    flex: 1,
    backgroundColor: '#f5f6f8',
  },
  header: {
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 30,
    width: '100%',
    zIndex: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 0,
  },
  logoCircle: {
    height: 45,
    width: 45,
    borderRadius: 22.5,
    marginRight: 10,
    backgroundColor: '#e5e7fa',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 16,
    fontFamily: 'Glacial Indifference Bold',
    color: '#333333',
  },
  greetingContainer: {
    flexDirection: 'column',
  },
  greeting: {
    fontSize: 18,
    color: '#333333',
    fontFamily: 'Glacial Indifference',
  },
  name: {
    fontSize: 20,
    color: '#111111',
    fontFamily: 'Glacial Indifference Bold',
  },
  navContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  navRow: {
    flexDirection: 'row',
    gap: 20,
    justifyContent: 'center',
  },
  navButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  navText: {
    fontSize: 18,
    color: '#333333',
    fontFamily: 'Glacial Indifference',
  },
  navTextActive: {
    textDecorationLine: 'underline',
  },
  settingsWrap: {
    position: 'relative',
    marginLeft: 'auto',
  },
  settingsButton: {
    backgroundColor: 'transparent',
    borderRadius: 8,
    padding: 4,
  },
  settingsButtonText: {
    fontSize: 24,
    color: '#333333',
    fontFamily: 'Glacial Indifference',
  },
  settingsMenu: {
    position: 'absolute',
    top: 40,
    right: 0,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    padding: 10,
    minWidth: 120,
  },
  menuButton: {
    backgroundColor: 'transparent',
    padding: 10,
    width: '100%',
  },
  menuButtonText: {
    textAlign: 'left',
    fontSize: 16,
    color: '#333333',
    fontFamily: 'Glacial Indifference',
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
    backgroundColor: '#efeafc',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  listButtonActive: {
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#d4aaff',
  },
  listButtonText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#333333',
    fontFamily: 'Glacial Indifference Bold',
  },
  addListButton: {
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  addListText: {
    color: '#aaaaaa',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Glacial Indifference',
  },
  taskContainer: {
    flexGrow: 1,
    backgroundColor: '#f7f7f7',
    borderRadius: 15,
    padding: 20,
    flexDirection: 'column',
    minHeight: 400,
    position: 'relative',
  },
  sectionTitle: {
    fontSize: 24,
    color: '#111111',
    marginBottom: 14,
    fontFamily: 'Glacial Indifference Bold',
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
    backgroundColor: '#efeafc',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    gap: 10,
  },
  circle: {
    fontSize: 20,
    color: '#333333',
    marginRight: 10,
    fontFamily: 'Glacial Indifference',
  },
  circleComplete: {
    color: '#27ae60',
  },
  taskTitle: {
    flexGrow: 1,
    textAlign: 'left',
    color: '#333333',
    fontSize: 18,
    fontFamily: 'Glacial Indifference',
  },
  taskTitleComplete: {
    textDecorationLine: 'line-through',
    color: '#777777',
  },
  addTaskButton: {
    backgroundColor: '#efeafc',
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
    color: '#333333',
    textAlign: 'left',
    fontFamily: 'Glacial Indifference',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
  },
  modalCard: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
    width: 300,
  },
  modalTitle: {
    textAlign: 'center',
    color: '#333333',
    fontSize: 18,
    fontFamily: 'Glacial Indifference',
  },
  starRow: {
    fontSize: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginVertical: 15,
  },
  star: {
    color: '#cccccc',
    fontSize: 30,
    fontFamily: 'Glacial Indifference',
  },
  starActive: {
    color: 'gold',
  },
  submitButton: {
    backgroundColor: '#d4aaff',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  submitButtonText: {
    fontSize: 16,
    color: '#333333',
    fontFamily: 'Glacial Indifference',
  },
});
