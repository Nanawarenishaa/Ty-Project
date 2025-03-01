package jdbcPractice;

public class day4 extends Thread {
    public day4(String name) {
        super(name);
    }

    @Override
    public void run() {
        for (int i = 1; i <= 5; i++) {
            System.out.println(getName() + ": Task " + i);
        }
    }

    public static void main(String[] args) {
        day4 thread1 = new day4("Thread One");
        day4 thread2 = new day4("Thread Two");

        thread1.start();
        thread2.start();

        System.out.println("Threads are running concurrently.");
    }
}
