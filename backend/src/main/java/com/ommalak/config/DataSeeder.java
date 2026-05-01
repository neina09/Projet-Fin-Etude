package com.ommalak.config;

import com.ommalak.entity.*;
import com.ommalak.enums.*;
import com.ommalak.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository              userRepository;
    private final WorkerProfileRepository     workerProfileRepository;
    private final TaskRepository              taskRepository;
    private final OfferRepository             offerRepository;
    private final BookingRepository           bookingRepository;
    private final NotificationRepository      notificationRepository;
    private final ReviewRepository            reviewRepository;
    private final PasswordEncoder             passwordEncoder;

    @Override
    @SuppressWarnings("null")
    public void run(String... args) {
        if (userRepository.count() > 0) {
            log.info("Database already seeded — skipping.");
            return;
        }
        log.info("Seeding database with demo data...");

        String pwd = passwordEncoder.encode("password123");

        // ── 1. ADMIN ──────────────────────────────────────────────────────────
        User admin = save(User.builder()
                .fullName("Administrateur Ommalak")
                .phone("+22220000001")
                .password(pwd)
                .role(UserRole.ADMIN)
                .city("Nouakchott")
                .createdAt(ago(60))
                .build());

        // ── 2. CLIENTS ────────────────────────────────────────────────────────
        User c1 = save(User.builder()
                .fullName("Mohamed Ould Ahmed")
                .phone("+22222111001")
                .password(pwd).role(UserRole.CLIENT).city("Nouakchott").createdAt(ago(50)).build());

        User c2 = save(User.builder()
                .fullName("Fatimetou Mint Cheikh")
                .phone("+22222111002")
                .password(pwd).role(UserRole.CLIENT).city("Nouadhibou").createdAt(ago(45)).build());

        User c3 = save(User.builder()
                .fullName("Mariem Mint Abdallahi")
                .phone("+22222111003")
                .password(pwd).role(UserRole.CLIENT).city("Rosso").createdAt(ago(40)).build());

        User c4 = save(User.builder()
                .fullName("Sidi Mohamed Ould Brahim")
                .phone("+22222111004")
                .password(pwd).role(UserRole.CLIENT).city("Zouerate").createdAt(ago(35)).build());

        User c5 = save(User.builder()
                .fullName("Khadija Mint Salem")
                .phone("+22222111005")
                .password(pwd).role(UserRole.CLIENT).city("Atar").createdAt(ago(30)).build());

        // ── 3. WORKERS ────────────────────────────────────────────────────────
        User w1 = save(User.builder()
                .fullName("Ahmed Ould Mokhtar")
                .phone("+22225221001")
                .password(pwd).role(UserRole.WORKER).city("Nouakchott").createdAt(ago(55)).build());

        User w2 = save(User.builder()
                .fullName("Abderrahmane Ould Youssef")
                .phone("+22225221002")
                .password(pwd).role(UserRole.WORKER).city("Nouakchott").createdAt(ago(52)).build());

        User w3 = save(User.builder()
                .fullName("Moussa Ould Ibrahima")
                .phone("+22225221003")
                .password(pwd).role(UserRole.WORKER).city("Nouadhibou").createdAt(ago(48)).build());

        User w4 = save(User.builder()
                .fullName("Zeinabou Mint Mohamed")
                .phone("+22225221004")
                .password(pwd).role(UserRole.WORKER).city("Rosso").createdAt(ago(44)).build());

        User w5 = save(User.builder()
                .fullName("Hamid Ould Vall")
                .phone("+22225221005")
                .password(pwd).role(UserRole.WORKER).city("Nouakchott").createdAt(ago(42)).build());

        User w6 = save(User.builder()
                .fullName("Cheikh Ould Tijani")
                .phone("+22225221006")
                .password(pwd).role(UserRole.WORKER).city("Atar").createdAt(ago(38)).build());

        User w7 = save(User.builder()
                .fullName("Aminetou Mint Bilal")
                .phone("+22225221007")
                .password(pwd).role(UserRole.WORKER).city("Zouerate").createdAt(ago(36)).build());

        User w8 = save(User.builder()
                .fullName("Brahim Ould Deye")
                .phone("+22225221008")
                .password(pwd).role(UserRole.WORKER).city("Kaédi").createdAt(ago(34)).build());

        // ── 4. WORKER PROFILES ────────────────────────────────────────────────
        workerProfileRepository.save(WorkerProfile.builder()
                .user(w1).profession("Plombier").salaryExpectation(3000.0)
                .bio("Spécialiste en plomberie résidentielle et commerciale avec 8 ans d'expérience à Nouakchott.")
                .idDocumentUrl("docs/w1_id.jpg").availability(Availability.AVAILABLE)
                .verified(true).rating(4.7).reviewCount(24).build());

        workerProfileRepository.save(WorkerProfile.builder()
                .user(w2).profession("Électricien").salaryExpectation(3500.0)
                .bio("Électricien certifié, installations basse tension et dépannage rapide. Disponible 7j/7.")
                .idDocumentUrl("docs/w2_id.jpg").availability(Availability.AVAILABLE)
                .verified(true).rating(4.9).reviewCount(41).build());

        workerProfileRepository.save(WorkerProfile.builder()
                .user(w3).profession("Menuisier").salaryExpectation(2800.0)
                .bio("Fabrication et pose de meubles, portes et fenêtres. Matériaux locaux et importés.")
                .idDocumentUrl("docs/w3_id.jpg").availability(Availability.BUSY)
                .verified(true).rating(4.5).reviewCount(18).build());

        workerProfileRepository.save(WorkerProfile.builder()
                .user(w4).profession("Peintre").salaryExpectation(2200.0)
                .bio("Peinture intérieure et extérieure, décoration murale, enduits. Travail soigné garanti.")
                .idDocumentUrl("docs/w4_id.jpg").availability(Availability.AVAILABLE)
                .verified(true).rating(4.3).reviewCount(12).build());

        workerProfileRepository.save(WorkerProfile.builder()
                .user(w5).profession("Maçon").salaryExpectation(4000.0)
                .bio("Construction, rénovation et finition. 12 ans d'expérience dans le BTP à Nouakchott.")
                .idDocumentUrl("docs/w5_id.jpg").availability(Availability.AVAILABLE)
                .verified(true).rating(4.6).reviewCount(33).build());

        workerProfileRepository.save(WorkerProfile.builder()
                .user(w6).profession("Mécanicien").salaryExpectation(3200.0)
                .bio("Réparation toutes marques, diagnostic électronique, entretien préventif.")
                .idDocumentUrl("docs/w6_id.jpg").availability(Availability.AVAILABLE)
                .verified(true).rating(4.8).reviewCount(27).build());

        // Pending (not yet verified)
        workerProfileRepository.save(WorkerProfile.builder()
                .user(w7).profession("Agent de nettoyage").salaryExpectation(1800.0)
                .bio("Nettoyage de bureaux, appartements et véhicules. Matériel professionnel fourni.")
                .idDocumentUrl("docs/w7_id.jpg").availability(Availability.AVAILABLE)
                .verified(false).rating(0.0).reviewCount(0).build());

        workerProfileRepository.save(WorkerProfile.builder()
                .user(w8).profession("Jardinier").salaryExpectation(2000.0)
                .bio("Entretien de jardins, taille, arrosage et aménagement paysager.")
                .idDocumentUrl("docs/w8_id.jpg").availability(Availability.AVAILABLE)
                .verified(false).rating(0.0).reviewCount(0).build());

        // ── 5. TASKS ──────────────────────────────────────────────────────────
        Task t1 = taskRepository.save(Task.builder()
                .title("Fuite d'eau dans la salle de bain")
                .description("J'ai une fuite importante sous le lavabo de ma salle de bain. L'eau coule depuis 2 jours. Besoin d'une intervention rapide.")
                .profession("Plombier").city("Nouakchott").budget(1500.0)
                .status(TaskStatus.OPEN).client(c1).createdAt(ago(5)).build());

        taskRepository.save(Task.builder()
                .title("Installation électrique appartement F3")
                .description("Nouvel appartement à câbler entièrement : tableau électrique, 12 prises, 8 interrupteurs, éclairage LED dans toutes les pièces.")
                .profession("Électricien").city("Nouakchott").budget(8000.0)
                .status(TaskStatus.IN_PROGRESS).client(c2).assignedWorker(w2).createdAt(ago(10)).build());

        taskRepository.save(Task.builder()
                .title("Fabrication d'une armoire sur mesure")
                .description("Armoire 2m x 2m, 4 portes coulissantes, bois MDF blanc. Livraison et installation comprises.")
                .profession("Menuisier").city("Nouadhibou").budget(12000.0)
                .status(TaskStatus.COMPLETED).client(c2).assignedWorker(w3).createdAt(ago(20)).build());

        Task t4 = taskRepository.save(Task.builder()
                .title("Peinture salon et chambre principale")
                .description("Salon de 30m² et chambre de 20m² à repeindre. Couleurs : blanc cassé pour le salon, beige pour la chambre. Préparation des murs incluse.")
                .profession("Peintre").city("Rosso").budget(4500.0)
                .status(TaskStatus.OPEN).client(c3).createdAt(ago(3)).build());

        Task t5 = taskRepository.save(Task.builder()
                .title("Construction d'un mur de clôture")
                .description("Mur de clôture en parpaings, 25 mètres linéaires, hauteur 2m. Terrain plat, accès facile.")
                .profession("Maçon").city("Zouerate").budget(25000.0)
                .status(TaskStatus.OPEN).client(c4).createdAt(ago(7)).build());

        taskRepository.save(Task.builder()
                .title("Réparation voiture Toyota Hilux")
                .description("Ma Toyota Hilux 2018 fait un bruit anormal au démarrage et perd de la puissance. Nécessite diagnostic complet.")
                .profession("Mécanicien").city("Atar").budget(5000.0)
                .status(TaskStatus.IN_PROGRESS).client(c5).assignedWorker(w6).createdAt(ago(4)).build());

        taskRepository.save(Task.builder()
                .title("Nettoyage complet villa 5 pièces")
                .description("Grande villa à nettoyer de fond en comble avant emménagement. Sols, vitres, sanitaires, cuisine. Matériel à fournir.")
                .profession("Agent de nettoyage").city("Nouakchott").budget(3000.0)
                .status(TaskStatus.PENDING).client(c1).createdAt(ago(1)).build());

        taskRepository.save(Task.builder()
                .title("Dépannage électrique urgent — panne totale")
                .description("Panne électrique totale depuis ce matin. Tableau général déclenché, impossible de remettre. Intervention urgente requise.")
                .profession("Électricien").city("Nouakchott").budget(2000.0)
                .status(TaskStatus.COMPLETED).client(c1).assignedWorker(w2).createdAt(ago(15)).build());

        Task t9 = taskRepository.save(Task.builder()
                .title("Pose de carrelage cuisine")
                .description("Cuisine de 18m² à carreler entièrement sol et murs (jusqu'à 1.5m). Carrelage déjà acheté, besoin de main d'œuvre.")
                .profession("Maçon").city("Nouakchott").budget(6000.0)
                .status(TaskStatus.OPEN).client(c3).createdAt(ago(2)).build());

        taskRepository.save(Task.builder()
                .title("Réparation toiture en zinc")
                .description("Toiture de 40m² qui fuit lors des pluies. Plusieurs plaques de zinc à remplacer et étanchéifier.")
                .profession("Maçon").city("Nouadhibou").budget(7000.0)
                .status(TaskStatus.CANCELLED).client(c2).createdAt(ago(25)).build());

        Task t11 = taskRepository.save(Task.builder()
                .title("Aménagement jardin villa")
                .description("Jardin de 80m² à aménager : pelouse, allées en gravier, quelques arbustes. Fourniture des plantes incluse.")
                .profession("Jardinier").city("Atar").budget(9000.0)
                .status(TaskStatus.OPEN).client(c5).createdAt(ago(6)).build());

        Task t12 = taskRepository.save(Task.builder()
                .title("Plomberie salle de bain complète")
                .description("Rénovation complète : remplacement baignoire par douche italienne, nouvelle robinetterie, recâblage chauffe-eau.")
                .profession("Plombier").city("Nouakchott").budget(15000.0)
                .status(TaskStatus.OPEN).client(c4).createdAt(ago(8)).build());

        // ── 6. OFFERS ────────────────────────────────────────────────────────
        offerRepository.save(Offer.builder()
                .task(t1).worker(w1)
                .message("Bonjour, je peux intervenir aujourd'hui même. J'ai tout le matériel nécessaire pour réparer cette fuite rapidement. Tarif tout inclus.")
                .price(1200.0).createdAt(ago(4)).build());

        offerRepository.save(Offer.builder()
                .task(t1).worker(w5)
                .message("Je suis disponible dès demain matin. En tant que maçon je gère aussi la plomberie basique. Je peux réparer et refermer le carrelage si nécessaire.")
                .price(1800.0).createdAt(ago(3)).build());

        offerRepository.save(Offer.builder()
                .task(t4).worker(w4)
                .message("Peintre professionnel avec 6 ans d'expérience. Je fournis la peinture de qualité supérieure. Délai : 3 jours.")
                .price(4000.0).createdAt(ago(2)).build());

        offerRepository.save(Offer.builder()
                .task(t5).worker(w5)
                .message("Devis pour 25m linéaires : fourniture parpaings + mortier + main d'œuvre. Délai estimé 5 jours. Je dispose d'une équipe de 2 personnes.")
                .price(23000.0).createdAt(ago(5)).build());

        offerRepository.save(Offer.builder()
                .task(t9).worker(w5)
                .message("Pose carrelage cuisine, je peux commencer dans 3 jours. Prix main d'œuvre seulement car vous avez déjà le carrelage.")
                .price(5500.0).createdAt(ago(1)).build());

        offerRepository.save(Offer.builder()
                .task(t12).worker(w1)
                .message("Rénovation complète salle de bain — mon domaine de prédilection. Je peux fournir un plan détaillé et commencer sous 48h.")
                .price(14000.0).createdAt(ago(6)).build());

        offerRepository.save(Offer.builder()
                .task(t11).worker(w8)
                .message("Je peux réaliser cet aménagement en 4 jours. Plantes locales résistantes à la chaleur mauritanienne. Garantie entretien 1 mois.")
                .price(8500.0).createdAt(ago(4)).build());

        offerRepository.save(Offer.builder()
                .task(t12).worker(w5)
                .message("Je m'associe avec un plombier pour ce projet. Nous pouvons gérer à la fois la plomberie et le carrelage pour un résultat parfait.")
                .price(16000.0).createdAt(ago(5)).build());

        // ── 7. BOOKINGS ──────────────────────────────────────────────────────
        bookingRepository.save(Booking.builder()
                .client(c1).worker(w2)
                .notes("Bonjour, j'ai besoin d'un électricien pour installer 3 prises supplémentaires dans mon bureau à domicile. Disponible samedi matin.")
                .status(BookingStatus.ACCEPTED).createdAt(ago(12)).build());

        bookingRepository.save(Booking.builder()
                .client(c2).worker(w3)
                .notes("Installation de portes intérieures pour mon appartement. 4 portes en bois mélaminé blanc. Livraison des portes prévue jeudi.")
                .status(BookingStatus.COMPLETED).createdAt(ago(22)).build());

        bookingRepository.save(Booking.builder()
                .client(c3).worker(w1)
                .notes("Fuite sous évier cuisine. Tuyau d'évacuation fissuré. Besoin d'intervention cette semaine.")
                .status(BookingStatus.PENDING).createdAt(ago(1)).build());

        bookingRepository.save(Booking.builder()
                .client(c4).worker(w6)
                .notes("Vidange et contrôle général de ma Land Cruiser avant un long trajet Zouerate–Nouakchott. Merci de prévoir 2h.")
                .status(BookingStatus.ACCEPTED).createdAt(ago(3)).build());

        bookingRepository.save(Booking.builder()
                .client(c5).worker(w4)
                .notes("Peinture de la façade extérieure de ma villa. Surface : 120m². Couleur : blanc avec liseré ocre. Disponible en semaine.")
                .status(BookingStatus.REJECTED).createdAt(ago(8)).build());

        // ── 8. REVIEWS ───────────────────────────────────────────────────────
        reviewRepository.save(Review.builder()
                .worker(w2).client(c1).rating(5)
                .comment("Excellent électricien, très professionnel et ponctuel. Travail impeccable, je recommande vivement !")
                .createdAt(ago(11)).build());

        reviewRepository.save(Review.builder()
                .worker(w3).client(c2).rating(4)
                .comment("Bon menuisier, l'armoire est très bien faite. Léger retard sur le délai annoncé mais le résultat est satisfaisant.")
                .createdAt(ago(19)).build());

        reviewRepository.save(Review.builder()
                .worker(w1).client(c3).rating(5)
                .comment("Ahmed a réparé la fuite en moins d'une heure. Très efficace, tarif honnête. Je le recommande sans hésitation.")
                .createdAt(ago(28)).build());

        reviewRepository.save(Review.builder()
                .worker(w5).client(c4).rating(4)
                .comment("Bon travail de maçonnerie, mur solide et bien fini. Le chantier a été laissé propre.")
                .createdAt(ago(14)).build());

        reviewRepository.save(Review.builder()
                .worker(w6).client(c5).rating(5)
                .comment("Cheikh a diagnostiqué et réparé mon véhicule rapidement. Prix juste et transparent. Mon mécanicien de confiance !")
                .createdAt(ago(9)).build());

        reviewRepository.save(Review.builder()
                .worker(w2).client(c2).rating(5)
                .comment("Intervention rapide pour la panne électrique, disponible même le week-end. Très professionnel.")
                .createdAt(ago(13)).build());

        // ── 9. NOTIFICATIONS ──────────────────────────────────────────────────
        notify(c1, NotificationType.OFFER,    "Ahmed Ould Mokhtar a soumis une offre pour votre tâche « Fuite d'eau dans la salle de bain »", ago(4));
        notify(c1, NotificationType.OFFER,    "Hamid Ould Vall a soumis une offre pour votre tâche « Fuite d'eau dans la salle de bain »", ago(3));
        notify(c1, NotificationType.BOOKING,  "Abderrahmane Ould Youssef a accepté votre demande de réservation", ago(11));
        notify(c1, NotificationType.SYSTEM,   "Bienvenue sur Ommalak ! Découvrez nos travailleurs vérifiés près de chez vous.", ago(50));

        notify(c2, NotificationType.BOOKING,  "Votre réservation avec Moussa Ould Ibrahima est terminée. Laissez un avis !", ago(20));
        notify(c2, NotificationType.OFFER,    "Hamid Ould Vall a soumis une offre pour votre tâche « Réparation toiture en zinc »", ago(23));
        notify(c2, NotificationType.SYSTEM,   "Bienvenue sur Ommalak ! Postez votre première tâche et recevez des offres.", ago(45));

        notify(c3, NotificationType.OFFER,    "Hamid Ould Vall a soumis une offre de 5 500 MRU pour votre tâche « Pose de carrelage cuisine »", ago(1));
        notify(c3, NotificationType.OFFER,    "Zeinabou Mint Mohamed a soumis une offre pour « Peinture salon et chambre principale »", ago(2));

        notify(c4, NotificationType.OFFER,    "Hamid Ould Vall a soumis une offre pour votre tâche « Construction d'un mur de clôture »", ago(5));
        notify(c4, NotificationType.BOOKING,  "Cheikh Ould Tijani a accepté votre réservation. Rendez-vous confirmé.", ago(3));

        notify(c5, NotificationType.BOOKING,  "Zeinabou Mint Mohamed a refusé votre demande de réservation.", ago(7));
        notify(c5, NotificationType.OFFER,    "Brahim Ould Deye a soumis une offre pour votre tâche « Aménagement jardin villa »", ago(4));

        notify(w1, NotificationType.BOOKING,  "Nouvelle demande de réservation de Mariem Mint Abdallahi. Répondez dès que possible.", ago(1));
        notify(w2, NotificationType.BOOKING,  "Nouvelle réservation confirmée avec Mohamed Ould Ahmed pour samedi matin.", ago(12));
        notify(w2, NotificationType.SYSTEM,   "Votre profil a été approuvé par l'administration. Vous pouvez maintenant recevoir des réservations !", ago(54));
        notify(w3, NotificationType.BOOKING,  "La réservation avec Fatimetou Mint Cheikh est marquée comme terminée. Merci pour votre travail !", ago(20));
        notify(w6, NotificationType.BOOKING,  "Nouvelle réservation de Sidi Mohamed Ould Brahim pour un entretien véhicule.", ago(3));

        notify(w7, NotificationType.APPROVAL, "Votre dossier de vérification est en cours d'examen par notre équipe. Vous serez notifié(e) sous 48h.", ago(1));
        notify(w8, NotificationType.APPROVAL, "Votre dossier de vérification est en cours d'examen par notre équipe. Vous serez notifié(e) sous 48h.", ago(1));

        notify(admin, NotificationType.APPROVAL, "2 nouveaux profils de travailleurs sont en attente de vérification.", ago(1));

        log.info("Seeding complete: {} users, {} tasks, {} bookings, {} notifications",
                userRepository.count(), taskRepository.count(),
                bookingRepository.count(), notificationRepository.count());
    }

    // ── helpers ───────────────────────────────────────────────────────────────

    private User save(User user) {
        if (user.getCreatedAt() == null) user.setCreatedAt(LocalDateTime.now());
        return userRepository.save(user);
    }

    private Task save(Task task) {
        if (task.getCreatedAt() == null) task.setCreatedAt(LocalDateTime.now());
        return taskRepository.save(task);
    }

    private Offer save(Offer offer) {
        if (offer.getCreatedAt() == null) offer.setCreatedAt(LocalDateTime.now());
        return offerRepository.save(offer);
    }

    private void notify(User user, NotificationType type, String message, LocalDateTime at) {
        notificationRepository.save(Notification.builder()
                .user(user).type(type).message(message)
                .read(false).createdAt(at).build());
    }

    private LocalDateTime ago(int days) {
        return LocalDateTime.now().minusDays(days);
    }
}
