import java.io.*;
import java.nio.file.*;
import java.util.*;
import javax.swing.*;
import java.awt.*;
import java.awt.event.*;
import java.time.LocalDateTime;

/**
 * Final Exam Grade Keeper Application
 * A simple program to track and manage student grades
 */
public class FinalExamApp {
    private static final String DATA_FILE = "student_grades.dat";
    private static final String[] MESSAGES = {
        "Grade saved successfully!",
        "Record added.",
        "Grade recorded.",
        "Successfully saved."
    };

    private static class GuiComponents {
        private final JFrame frame;
        private final JTextField nameField;
        private final JTextField gradeField;
        private final JTextArea displayArea;
        
        public GuiComponents() {
            frame = new JFrame("Grade Keeper");
            nameField = new JTextField();
            gradeField = new JTextField();
            displayArea = new JTextArea(10, 30);
        }
    }

    public static void main(String[] args) {
        GuiComponents gui = new GuiComponents();
        gui.frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        gui.frame.setSize(400, 300);

        JPanel mainPanel = new JPanel(new GridBagLayout());
        GridBagConstraints constraints = new GridBagConstraints();
        constraints.insets = new Insets(5, 5, 5, 5);

        gui.displayArea.setEditable(false);
        JScrollPane scrollPane = new JScrollPane(gui.displayArea);

        JButton saveButton = createButton("Save Grade");
        JButton viewButton = createButton("View Grades");
        JButton exitButton = createButton("Exit");

        saveButton.addActionListener(e -> {
            String studentName = gui.nameField.getText();
            String grade = gui.gradeField.getText();
            saveGrade(studentName, grade, gui);
        });

        viewButton.addActionListener(e -> viewGrades(gui));
        exitButton.addActionListener(e -> System.exit(0));

        assembleLayout(mainPanel, constraints, gui, saveButton, viewButton, exitButton, scrollPane);

        gui.frame.add(mainPanel);
        gui.frame.setVisible(true);
    }

    private static JButton createButton(String text) {
        JButton button = new JButton(text);
        button.setFocusPainted(false);
        return button;
    }

    private static void saveGrade(String studentName, String grade, GuiComponents gui) {
        try (BufferedWriter writer = new BufferedWriter(new FileWriter(DATA_FILE, true))) {
            String timestamp = LocalDateTime.now().toString();
            String entry = String.format("%s | Student: %s | Grade: %s", 
                timestamp, studentName, grade);
            writer.write(entry);
            writer.newLine();
            
            String message = MESSAGES[new Random().nextInt(MESSAGES.length)];
            JOptionPane.showMessageDialog(gui.frame, message);
        } catch (IOException ex) {
            JOptionPane.showMessageDialog(gui.frame, "Error saving grade: " + ex.getMessage());
        }
    }

    private static void viewGrades(GuiComponents gui) {
        try {
            List<String> grades = Files.readAllLines(Paths.get(DATA_FILE));
            gui.displayArea.setText(String.join("\n", grades));
        } catch (IOException ex) {
            JOptionPane.showMessageDialog(gui.frame, "Error reading grades: " + ex.getMessage());
        }
    }

    private static void assembleLayout(JPanel panel, GridBagConstraints c, 
            GuiComponents gui, JButton... buttons) {
        addComponentToLayout(panel, new JLabel("Student Name:"), c, 0, 0);
        addComponentToLayout(panel, gui.nameField, c, 1, 0);
        addComponentToLayout(panel, new JLabel("Grade:"), c, 0, 1);
        addComponentToLayout(panel, gui.gradeField, c, 1, 1);

        int row = 2;
        for (JButton button : buttons) {
            addComponentToLayout(panel, button, c, row % 2, row / 2 + 1);
            row++;
        }
    }

    private static void addComponentToLayout(JPanel panel, Component comp, 
            GridBagConstraints c, int x, int y) {
        c.gridx = x;
        c.gridy = y;
        panel.add(comp, c);
    }
}