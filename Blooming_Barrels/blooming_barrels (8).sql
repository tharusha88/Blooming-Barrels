-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 24, 2025 at 07:46 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `blooming_barrels`
--

-- --------------------------------------------------------

--
-- Table structure for table `articles`
--

CREATE TABLE `articles` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` longtext NOT NULL,
  `excerpt` text DEFAULT NULL,
  `author_id` int(11) NOT NULL,
  `category_id` int(11) DEFAULT NULL,
  `status` enum('draft','published') DEFAULT 'draft',
  `featured_image` varchar(500) DEFAULT NULL,
  `publish_date` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `views_count` int(11) DEFAULT 0,
  `rating_average` decimal(3,2) DEFAULT 0.00,
  `rating_count` int(11) DEFAULT 0,
  `published_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `articles`
--

INSERT INTO `articles` (`id`, `title`, `content`, `excerpt`, `author_id`, `category_id`, `status`, `featured_image`, `publish_date`, `created_at`, `updated_at`, `views_count`, `rating_average`, `rating_count`, `published_at`) VALUES
(2, '', '', NULL, 4, 1, 'draft', NULL, NULL, '2025-08-10 01:48:12', '2025-08-20 16:52:15', 0, 0.00, 0, NULL),
(3, 'Cactus and Succulent Care Tips', 'Lighting Matters: Place your cacti and succulents in a bright location where they can receive plenty of sunlight. They thrive in direct or indirect sunlight, so a sunny windowsill is ideal.\n\nModerate Watering: Overwatering is a common mistake. Allow the soil to dry out completely between waterings. Water sparingly, typically once every 2-3 weeks, depending on the environment and season.\n\nWell-Draining Soil: Use a well-draining cactus or succulent-specific soil mix. This helps prevent root rot, which is a common issue with these plants.\n\nContainer Choice: Plant your cacti and succulents in pots with drainage holes to ensure excess water can escape. This prevents waterlogged soil.\n\nTemperature Tolerance: Most cacti and succulents prefer warm temperatures but can tolerate occasional cooler nights. Avoid frost, as it can harm them.\n\nFertilize Sparingly: Feed your plants with a diluted, balanced, liquid fertilizer during the growing season (spring and summer). Do this sparingly, as they don\'t require much nutrition.\n\nPruning and Deadheading: Remove dead or yellowing leaves to encourage healthy growth and prevent pests and diseases.\n\nContainer Size: Choose a container that is proportionate to the size of your plant. Cacti and succulents like to be snug in their pots.\n\nRepotting: Repot your plants every 2-3 years, or when they outgrow their containers. Spring is the best time for repotting.\n\nPest Control: Keep an eye out for common pests like mealybugs and scale insects. Treat infestations promptly with insecticidal soap or neem oil.\n\nGrouping Plants: Grouping cacti and succulents together can create a microclimate with higher humidity, which some species appreciate.\n\nResearch Specifics: Different cacti and succulent species have varying care requirements. Research the specific needs of your plants for the best results.\n\nRemember, patience is key when caring for cacti and succulents. They often grow slowly, so don\'t be alarmed if you don\'t see rapid changes. Enjoy the unique beauty they bring to your space!', 'How to Care Cactus and Succulents correctly', 4, 1, 'published', '', NULL, '2025-08-10 01:54:26', '2025-08-20 16:52:15', 0, 0.00, 0, '2025-08-10 07:24:27'),
(4, 'Plumosa Cactus (Mammillaria plumosa)', 'The world of cacti is full of fascinating varieties, but few are as unique and charming as the **Plumosa Cactus** (*Mammillaria plumosa*). With its delicate, feathery spines that resemble soft white clouds, this cactus is a favorite among plant collectors and succulent enthusiasts. However, despite its fluffy appearance, it is a true desert survivor!  \n\n **What is the Plumosa Cactus?**  \nThe **Plumosa Cactus** belongs to the *Mammillaria* genus, a diverse group of small, round cacti. It is native to **northeastern Mexico**, where it grows in rocky, arid environments. The name \"plumosa\" comes from the Latin word for \"feathery,\" referring to its fine, white spines that cover the plant’s body like a soft cushion.  \n\n **Key Features:**  \n✔ **Compact Growth** – This cactus forms small, rounded clusters that can spread up to 6 inches (15 cm) in diameter.  \n✔ **Feathery Spines** – Unlike sharp cactus spines, its thin white filaments give it a soft, downy look.  \n✔ **Blooms Beautifully** – It produces **small, white or pale pink flowers**, usually in late summer or early fall.  \n✔ **Drought-Tolerant** – Like most cacti, it requires minimal watering and thrives in dry conditions.  \n\n **How to Care for the Plumosa Cactus**  \nThe **Plumosa Cactus** is easy to care for, making it a perfect addition to any succulent collection. Here’s how to keep it healthy and thriving:  \n\n🌞 **Light Requirements**  \nThis cactus prefers **bright, indirect sunlight** or **partial direct sun**. If kept indoors, place it near a **south- or west-facing window** for the best light exposure. Too much harsh sun can cause sunburn, while too little light may lead to weak, stretched growth.  \n\n 💧 **Watering**  \nThe **\"soak and dry\"** method works best. Water **only when the soil is completely dry**, roughly **once every 2–3 weeks in summer** and even less in winter. Overwatering can cause **root rot**, which is the most common cause of cactus problems.  \n\n 🌱 **Soil & Potting**  \n- Use a **well-draining cactus or succulent mix**.  \n- Add **perlite, sand, or pumice** to improve drainage.  \n- Always plant it in a **pot with drainage holes** to prevent water retention.  \n\n 🌡 **Temperature & Humidity**  \n- Thrives in warm temperatures between **60–85°F (16–29°C)**.  \n- Cannot tolerate frost! If temperatures drop below **50°F (10°C)**, move it indoors.  \n- Prefers **low humidity**, as excessive moisture can lead to fungal issues.  \n\n🌸 **Flowering & Growth**  \nWith proper care, the **Plumosa Cactus** may reward you with small, delicate flowers in late summer or fall. It grows slowly, forming small clusters over time.  \n\n **Common Problems & Solutions**  \n🔴 **Overwatering** → Causes root rot and mushy stems. **Solution:** Let the soil dry completely before watering again.  \n🟡 **Sunburn** → Leaves may turn yellow or brown if exposed to too much direct sun. **Solution:** Provide filtered sunlight or move to a slightly shadier spot.  \n⚪ **Pests** → Occasionally affected by **mealybugs or spider mites**. **Solution:** Treat with neem oil or insecticidal soap if necessary.  \n\n **Propagation**  \nThe easiest way to propagate the **Plumosa Cactus** is through **offsets (pups)**. These small baby cacti grow at the base of the main plant and can be carefully separated and replanted in dry soil.  \n\n **Why You Should Grow a Plumosa Cactus**  \n🌵 **Unique Appearance** – Its feathery spines make it stand out from other cacti.  \n🌵 **Low-Maintenance** – Perfect for beginners and busy plant lovers.  \n🌵 **Space-Saving** – Its compact size makes it great for small apartments or offices.  \n🌵 **Air-Purifying** – Like most plants, it helps improve air quality in your home.  \n\n **Final Thoughts**  \nThe **Plumosa Cactus** is a rare gem in the succulent world, combining elegance with resilience. Whether you’re a beginner or a seasoned collector, this **soft-looking yet hardy plant** will add charm to your space with minimal effort.  \n\nDo you own a Plumosa Cactus? Share your experience in the comments! 🌵💚  \n', 'Plumosa Cactus: The Fluffy Yet Resilient Desert Beauty', 4, 1, 'published', '/backend-php/uploads/articles/article_6898303ad04b6_1754804282.jpg', NULL, '2025-08-10 02:08:23', '2025-08-20 16:52:15', 0, 0.00, 0, '2025-08-10 07:38:27'),
(5, '🌿 Zebra Succulent: The Perfect Low-Maintenance Houseplant! 🌿', '✨ Why You’ll Love It:\n✅ Eye-Catching Beauty – With its dark green, pointed leaves and white stripe-like patterns, the Zebra Succulent adds a bold touch to any space.\n✅ Easy to Care For – It thrives with minimal effort—just a little sunlight and occasional watering!\n✅ Perfect for Indoors – Unlike some succulents, it doesn’t need full sun, making it ideal for homes, offices, or desks.\n✅ Air-Purifying – This plant not only looks great but also helps clean the air.\n\n💡 Care Tips:\n☀️ Light: Prefers bright, indirect sunlight but can tolerate low light.\n💧 Watering: Water only when the soil is completely dry (about once every 2-3 weeks). Overwatering can cause root rot.\n🌱 Soil: Use well-draining cactus or succulent mix.\n🏡 Pot: A pot with drainage holes is a must!\n\n🌼 Bonus: If you\'re lucky, your Zebra Succulent may bloom with small, white flowers in the right conditions!\n\nThis plant is pet-friendly and can live for years with proper care. Whether you\'re a beginner or an experienced plant lover, the Zebra Succulent is a must-have!\n\nDo you already have one? Share a photo of your beautiful Zebra Succulent in the comments! 📸💚\n', 'Looking for a stylish, low-maintenance plant to brighten up your home or office? Meet the Zebra Succulent (Haworthiopsis fasciata)—a small yet stunning plant known for its unique striped leaves and easy-care nature.', 4, 1, 'published', '/uploads/zeebra.jpg', NULL, '2025-08-10 02:19:20', '2025-08-20 19:52:32', 0, 0.00, 0, '2025-08-10 07:49:45'),
(6, 'Cacti and Succulents: The Resilient Wonders of the Plant World', 'Cacti and succulents have become incredibly popular in homes and gardens due to their unique appearance and minimal care requirements. These plants thrive in arid conditions, making them perfect for modern, low-maintenance gardening. But what exactly sets cacti and succulents apart, and how can you care for them? Let\'s take a closer look.\n\nWhat Are Cacti and Succulents?\n\nAt first glance, cacti and succulents may seem very similar, but they belong to different plant families and have distinct characteristics.\n\n**Cacti**:\nCacti are members of the *Cactaceae* family and are mainly found in the Americas, especially in deserts. One of the most iconic features of cacti is their spines, which are modified leaves that help reduce water loss and protect the plant from herbivores. Cacti also have specialized stems that store water, helping them survive in harsh desert conditions.\n\n**Succulents**:\nSucculents are a broader category that includes many different families of plants, including the *Crassulaceae*, *Aizoaceae*, and *Agavaceae* families. The common trait among all succulents is that they have thick, fleshy tissues that store water. These plants are found in a variety of environments, from deserts to tropical regions. While some succulents may resemble cacti, they typically do not have spines and may have smooth or waxy leaves.\n\n Key Differences Between Cacti and Succulents\n\nWhile all cacti are succulents, not all succulents are cacti. Here are the key differences:\n\n1. **Spines vs. Leaves**: Cacti typically have spines, while most succulents have fleshy, rounded leaves. The spines on cacti serve multiple purposes, including reducing water loss and protecting the plant from animals. Succulents rely on their thick leaves to store water.\n\n2. **Flowering**: Cacti tend to produce showy, large flowers that often grow directly from the plant’s body. These flowers are typically brightly colored, attracting pollinators like bees and birds. Succulents also flower, but their blooms tend to be smaller and less conspicuous.\n\n3. **Stem Structure**: Cacti have thick, fleshy stems that store water, and their structure is typically more rounded or columnar. Many succulents have thick leaves, which may store water, while others have specialized stems.\n\n### Benefits of Growing Cacti and Succulents\n\n1. **Low Maintenance**: Both cacti and succulents are incredibly low-maintenance plants. They require minimal watering, making them ideal for busy people or those new to gardening. Overwatering is actually a common mistake, as these plants are adapted to dry conditions.\n\n2. **Air Purification**: Like most plants, cacti and succulents help purify the air by absorbing carbon dioxide and releasing oxygen. They also filter toxins, which can help improve indoor air quality.\n\n3. **Aesthetic Appeal**: The unique shapes, textures, and colors of cacti and succulents make them beautiful additions to any space. They can be used in a variety of ways, from adding a pop of greenery to your office desk to creating a desert-themed garden in your backyard.\n\n4. **Water Conservation**: Cacti and succulents are great choices for drought-tolerant landscaping. By choosing these plants, you can create a beautiful garden that conserves water, which is especially important in regions where water scarcity is a concern.\n\n How to Care for Cacti and Succulents\n\nAlthough they are hardy and easy to grow, cacti and succulents do have some specific care requirements. Here’s how to keep them healthy:\n\n1. **Light**: Both cacti and succulents need plenty of sunlight to thrive. They should be placed in a sunny window or under grow lights if kept indoors. While some species can tolerate partial shade, most will flourish in bright, direct sunlight.\n\n2. **Watering**: Overwatering is a common mistake with cacti and succulents. These plants store water in their leaves or stems, so they don’t need frequent watering. In fact, it’s better to let the soil dry out completely between waterings. During the winter months, reduce watering as many of these plants go dormant.\n\n3. **Soil**: Well-draining soil is essential for both cacti and succulents. Use a cactus or succulent-specific potting mix or add sand or perlite to regular potting soil to improve drainage.\n\n4. **Temperature**: Most cacti and succulents prefer warm temperatures. They thrive in environments between 60°F and 85°F (15°C to 29°C). They can tolerate heat but should be protected from frost and cold temperatures.\n\n5. **Containers**: When planting in containers, make sure the pots have drainage holes to prevent water from accumulating at the bottom, which can cause root rot. Choose containers made of clay, ceramic, or other porous materials to allow for better airflow.\n\n Popular Cacti and Succulents to Grow\n\nThere are hundreds of species of cacti and succulents to choose from. Here are a few of the most popular varieties:\n\n**Cacti**:\n- **Saguaro Cactus (Carnegiea gigantea)**: Known for its tall, tree-like structure and iconic arms, the saguaro cactus is a symbol of the American Southwest.\n- **Prickly Pear (Opuntia)**: A low-growing cactus with flat, paddle-shaped pads and colorful flowers.\n- **Barrel Cactus (Ferocactus)**: These round, spiny cacti are often found in desert landscapes and can grow quite large.\n\n**Succulents**:\n- **Aloe Vera**: Known for its soothing gel, Aloe Vera is a popular succulent with fleshy, thick leaves. It’s also an excellent air purifier.\n- **Echeveria**: A rosette-forming succulent with attractive blue-green leaves that have a powdery coating.\n- **Jade Plant (Crassula ovata)**: A popular indoor succulent with thick, glossy, green leaves and a tree-like shape.\n', 'Cacti and succulents have become incredibly popular in homes and gardens due to their unique appearance and minimal care requirements. These plants thrive in arid conditions, making them perfect for modern, low-maintenance gardening. But what exactly sets cacti and succulents apart, and how can you care for them? Let\'s take a closer look.', 4, 1, 'published', '/backend-php/uploads/articles/article_6898367549674_1754805877.jpg', NULL, '2025-08-10 02:34:40', '2025-08-20 16:52:15', 0, 0.00, 0, '2025-08-10 08:04:46'),
(14, 'Cactus: The Resilient Desert Marvel', 'Cacti are some of the most fascinating and resilient plants in the botanical world. Belonging to the family Cactaceae, these plants are primarily native to the Americas, ranging from the deserts of North America to the tropical regions of South America. Known for their unique shapes, spines, and remarkable ability to survive in extreme conditions, cacti have captured the interest of botanists, gardeners, and plant enthusiasts alike.\n\nUnique Adaptations\n\nCacti have evolved a variety of adaptations that allow them to thrive in arid environments. Their thick, fleshy stems store water, enabling the plant to survive prolonged droughts. Unlike most plants, cacti have reduced or no leaves; instead, they grow spines, which minimize water loss and provide protection from herbivores. Some cacti also have a waxy coating on their stems to further reduce water evaporation.\n\nVariety and Beauty\n\nThere are over 2,000 species of cacti, ranging from small, round globes to towering columnar structures. Some species produce stunning flowers in shades of red, yellow, pink, and white, often blooming for just a day or night. The Saguaro cactus, for example, is iconic for its towering stature and beautiful white flowers, while the Echinocactus is known for its bright yellow blooms.\n\nCaring for Cacti\n\nCacti are low-maintenance plants, making them perfect for indoor gardens and offices. They require:\n\nWell-draining soil: Sand or special cactus soil prevents root rot.\n\nSunlight: Most cacti thrive in bright, indirect sunlight.\n\nMinimal watering: Overwatering is the most common cause of cactus death; water sparingly and allow the soil to dry between watering.\n\nCultural and Economic Significance\n\nCacti are not just ornamental; they have practical uses too. Some species, like the Prickly Pear (Opuntia), provide edible fruits and pads. Indigenous communities have used cacti for food, medicine, and even natural fencing. In modern times, cacti have become a symbol of endurance and adaptability, often featured in art and décor.\n\nConclusion\n\nCacti are remarkable examples of nature’s ingenuity. Their ability to survive harsh environments, combined with their beauty and utility, makes them a favorite among plant lovers. Whether growing in a desert landscape or as a potted plant on a windowsill, cacti remind us of the resilience and creativity of the natural world.', 'Cacti are resilient plants native to the Americas, known for their ability to survive in arid environments. They have thick, water-storing stems, spines instead of leaves, and often a waxy coating to reduce water loss. With over 2,000 species, cacti vary from small globes to tall columnar forms and often produce striking flowers. Easy to care for, they need well-draining soil, sunlight, and minimal watering. Beyond their beauty, cacti have cultural and economic importance, providing food, medicine, and inspiration. They symbolize endurance and adaptability in nature.', 23, 1, 'published', '/uploads/ruru (1).png', NULL, '2025-08-20 08:04:50', '2025-08-20 19:51:53', 0, 0.00, 0, NULL),
(15, '🌵 Cactus: Nature’s Master of Survival', '🌵 Cactus: Nature’s Master of Survival\nCacti, members of the plant family Cactaceae, are iconic for their ability to thrive in some of the harshest environments on Earth. With nearly 2,000 species across 139 genera, these plants are native primarily to the Americas, stretching from Canada to Patagonia, with one exception—Rhipsalis baccifera, which also grows in Africa and Sri Lanka.\n\n🧬 Unique Adaptations\nCacti are succulent perennials, meaning they store water in their thick, fleshy stems. Their leaves have evolved into spines, which:\n\nReduce water loss\n\nProvide shade\n\nDeter herbivores\n\nInstead of leaves, their stems handle photosynthesis, often using a specialized method called Crassulacean Acid Metabolism (CAM) to conserve water.\n\n🌸 Structure and Growth\nCactus stems are often ribbed or fluted, allowing them to expand quickly after rainfall. Their spines and flowers grow from areoles, which are unique to cacti and act like miniature growth hubs.\n\n🌍 Ecological Importance\nIn desert ecosystems, cacti:\n\nProvide food and water for animals\n\nServe as shelter\n\nHelp stabilize soil\n\nHumans have used cacti for centuries—for food, medicine, and even rituals. Today, they’re popular as ornamental plants, admired for their resilience and sculptural beauty.\n\n⚠️ Conservation Note\nSome cactus species are endangered due to habitat loss and overharvesting. Conservation efforts aim to protect these fascinating plants and their ecosystems.', 'Cacti, members of the plant family Cactaceae, are iconic for their ability to thrive in some of the harshest environments on Earth. With nearly 2,000 species across 139 genera, these plants are native primarily to the Americas, stretching from Canada to Patagonia, with one exception—Rhipsalis baccifera, which also grows in Africa and Sri Lanka', 23, 1, 'published', '/uploads/resilence.png', NULL, '2025-08-20 08:06:25', '2025-08-20 19:51:21', 0, 0.00, 0, NULL),
(17, ' 🌵🌵🌵🌵Cactus Gardening Tips: From Desert Charm to Your Backyard🌵🌵', 'Cactus gardens bring a slice of the desert’s beauty into your home or outdoor space. They’re low-maintenance, visually striking, and perfect for gardeners who appreciate both form and function.\n\n☀️ 1. Choose the Right Location\nSunlight is key — most cacti need at least 6 hours of direct sunlight daily.\n\nIndoors: Place near a south-facing window.\n\nOutdoors: Pick a spot sheltered from strong winds but open to full sun.\n\n🪴 2. Select Species for Your Climate\nHot climates: Saguaro (Carnegiea gigantea), Golden Barrel (Echinocactus grusonii).\n\nCooler zones: Cold-hardy Prickly Pear (Opuntia humifusa).\n\nAlways check local invasive species lists before planting.\n\n🏜 3. Perfect the Soil Mix\nUse well-draining soil — a cactus/succulent mix or a blend of sand, perlite, and potting soil.\n\nAvoid heavy clay; it traps water and causes root rot.\n\n💧 4. Water Wisely\nFollow the “soak and dry” method: water deeply, then let the soil dry completely.\n\nReduce watering in winter when growth slows.\n\n🌸 5. Add Visual Variety\nMix heights, shapes, and colors for a dynamic display.\n\nCombine tall columnar cacti with round globes and flowering varieties like Echinopsis.\n\n🐝 6. Encourage Pollinators\nFlowering cacti attract bees, butterflies, and hummingbirds.\n\nPlant alongside other drought-tolerant blooms for a pollinator-friendly garden.\n\n🛡 7. Protect from Pests & Rot\nWatch for mealybugs and scale insects; treat early with neem oil or insecticidal soap.\n\nEnsure airflow around plants to prevent fungal issues.\n\n✂️ 8. Maintenance & Styling\nRemove dead flowers and damaged pads to keep plants healthy.\n\nUse decorative gravel or stones to enhance aesthetics and improve drainage.\n\n💡 Pro Tip: For a modern touch, you could design a minimalist cactus garden in raised beds or geometric planters — something that would pair beautifully with your clean, modular design style.', 'Cactus gardens bring a slice of the desert’s beauty into your home or outdoor space. They’re low-maintenance, visually striking, and perfect for gardeners who appreciate both form and function.', 23, 3, 'published', '/uploads/rere.jpg', NULL, '2025-08-20 12:52:31', '2025-08-20 19:28:19', 0, 0.00, 0, NULL),
(18, 'How to Care for a Cactus: The Complete Guide', '☀️1. Light Requirements\nDesert cacti thrive in bright, direct sunlight for 4–6 hours a day. A south‑facing window is ideal indoors.\n\nForest cacti (like holiday cacti) prefer bright, indirect light and can tolerate partial shade.\n\nRotate plants occasionally so all sides receive equal light and avoid leaning or uneven growth.\n\n💧 2. Watering Schedule\nFollow the “soak and dry” method: water thoroughly, then let the soil dry out completely before watering again.\n\nIn summer, watering may be needed weekly; in winter, only every 4–6 weeks as growth slows.\n\nOverwatering is the most common cause of cactus death — soft, mushy stems are a warning sign.\n\n\nYesterday\ngive me a article about cactus\nSure thing, Tharusha! Here\'s a compact and engaging article about cacti—those spiky survivors of the plant world 🌵\n\n🌵 Cactus: Nature’s Master of Survival\nCacti, members of the plant family Cactaceae, are iconic for their ability to thrive in some of the harshest environments on Earth. With nearly 2,000 species across 139 genera, these plants are native primarily to the Americas, stretching from Canada to Patagonia, with one exception—Rhipsalis baccifera, which also grows in Africa and Sri Lanka.\n\n🧬 Unique Adaptations\nCacti are succulent perennials, meaning they store water in their thick, fleshy stems. Their leaves have evolved into spines, which:\n\nReduce water loss\n\nProvide shade\n\nDeter herbivores\n\nInstead of leaves, their stems handle photosynthesis, often using a specialized method called Crassulacean Acid Metabolism (CAM) to conserve water.\n\n🌸 Structure and Growth\nCactus stems are often ribbed or fluted, allowing them to expand quickly after rainfall. Their spines and flowers grow from areoles, which are unique to cacti and act like miniature growth hubs.\n\n🌍 Ecological Importance\nIn desert ecosystems, cacti:\n\nProvide food and water for animals\n\nServe as shelter\n\nHelp stabilize soil\n\nHumans have used cacti for centuries—for food, medicine, and even rituals. Today, they’re popular as ornamental plants, admired for their resilience and sculptural beauty.\n\n⚠️ Conservation Note\nSome cactus species are endangered due to habitat loss and overharvesting. Conservation efforts aim to protect these fascinating plants and their ecosystems.\n\nIf you’d like a version tailored for a blog, academic paper, or even a fun infographic, I can whip that up too. Want to dive into cactus-inspired UI design next? I bet you could make a killer dashboard theme with desert tones and geometric textures.\n\n\n\n\n\nEdit in a page\ngenerate a jpg to add this article\n\n\n\nHere you go, Tharusha—the image is ready and perfectly suited to complement your cactus article 🌵\n\nLet me know if you\'d like a version with your own branding, a different layout, or even a desert-themed UI mockup to match your Blooming Barrels aesthetic.\n\n\"Cactus: The Resilient Desert Marvel Cacti are some of the most fascinating and resilient plants in the botanical world. Belonging to the family Cactaceae, these plants are primarily native to the Americas, ranging from the deserts of North America to the tropical regions of South America. Known for their unique shapes, spines, and remarkable ability to survive in extreme conditions, cacti have captured the interest of botanists, gardeners, and plant enthusiasts alike. Unique Adaptations Cacti have evolved a variety of adaptations that allow them to thrive in arid environments. Their thick, fleshy stems store water, enabling the plant to survive prolonged droughts. Unlike most plants, cacti have reduced or no leaves; instead, they grow spines, which minimize water loss and provide protection from herbivores. Some cacti also have a waxy coating on their stems to further reduce water evaporation. Variety and Beauty There are over 2,000 species of cacti, ranging from small, round globes to towering columnar structures. Some species produce stunning flowers in shades of red, yellow, pink, and white, often blooming for just a day or night. The Saguaro cactus, for example, is iconic for its towering stature and beautiful white flowers, while the Echinocactus is known for its bright yellow blooms. Caring for Cacti Cacti are low-maintenance plants, making them perfect for indoor gardens and offices. They require: Well-draining soil: Sand or special cactus soil prevents root rot. Sunlight: Most cacti thrive in bright, indirect sunlight. Minimal watering: Overwatering is the most common cause of cactus death; water sparingly and allow the soil to dry between watering. Cultural and Economic Significance Cacti are not just ornamental; they have practical uses too. Some species, like the Prickly Pear (Opuntia), provide edible fruits and pads. Indigenous communities have used cacti for food, medicine, and even natural fencing. In modern times, cacti have become a symbol of endurance and adaptability, often featured in art and décor. Conclusion Cacti are remarkable examples of nature’s ingenuity. Their ability to survive harsh environments, combined with their beauty and utility, makes them a favorite among plant lovers. Whether growing in a desert landscape or as a potted plant on a windowsill, cacti remind us of the resilience and creativity of the natural world. \" create a jpeg to this article also\n\"Cactus: The Resilient Desert Marvel Cacti are some of the most fascinating and resilient plants in the botanical world. Belonging to the family Cactaceae, these plants are primarily native to the Americas, ranging from the deserts of North America to the tropical regions of South America. Known for their unique shapes, spines, and remarkable ability to survive in extreme conditions, cacti have captured the interest of botanists, gardeners, and plant enthusiasts alike. Unique Adaptations Cacti have evolved a variety of adaptations that allow them to thrive in arid environments. Their thick, fleshy stems store water, enabling the plant to survive prolonged droughts. Unlike most plants, cacti have reduced or no leaves; instead, they grow spines, which minimize water loss and provide protection from herbivores. Some cacti also have a waxy coating on their stems to further reduce water evaporation. Variety and Beauty There are over 2,000 species of cacti, ranging from small, round globes to towering columnar structures. Some species produce stunning flowers in shades of red, yellow, pink, and white, often blooming for just a day or night. The Saguaro cactus, for example, is iconic for its towering stature and beautiful white flowers, while the Echinocactus is known for its bright yellow blooms. Caring for Cacti Cacti are low-maintenance plants, making them perfect for indoor gardens and offices. They require: Well-draining soil: Sand or special cactus soil prevents root rot. Sunlight: Most cacti thrive in bright, indirect sunlight. Minimal watering: Overwatering is the most common cause of cactus death; water sparingly and allow the soil to dry between watering. Cultural and Economic Significance Cacti are not just ornamental; they have practical uses too. Some species, like the Prickly Pear (Opuntia), provide edible fruits and pads. Indigenous communities have used cacti for food, medicine, and even natural fencing. In modern times, cacti have become a symbol of endurance and adaptability, often featured in art and décor. Conclusion Cacti are remarkable examples of nature’s ingenuity. Their ability to survive harsh environments, combined with their beauty and utility, makes them a favorite among plant lovers. Whether growing in a desert landscape or as a potted plant on a windowsill, cacti remind us of the resilience and creativity of the natural world. \" create a different type of jpeg to this article also\n\n\n\nHere’s your fresh take, Tharusha — a new visual spin on your “Cactus: The Resilient Desert Marvel” article is ready 🌵✨\n\nIf you’d like, I can also style an alternate minimalist, typography-heavy version or even a color-rich, magazine-style spread so you have options for different audiences and platforms.\n\ngive me a article about cactus gardenin tips\nAbsolutely, Tharusha 🌵 — let’s craft something practical yet inspiring so you can turn any space into a thriving cactus haven.\n\n🌵 Cactus Gardening Tips: From Desert Charm to Your Backyard\nCactus gardens bring a slice of the desert’s beauty into your home or outdoor space. They’re low-maintenance, visually striking, and perfect for gardeners who appreciate both form and function.\n\n☀️ 1. Choose the Right Location\nSunlight is key — most cacti need at least 6 hours of direct sunlight daily.\n\nIndoors: Place near a south-facing window.\n\nOutdoors: Pick a spot sheltered from strong winds but open to full sun.\n\n🪴 2. Select Species for Your Climate\nHot climates: Saguaro (Carnegiea gigantea), Golden Barrel (Echinocactus grusonii).\n\nCooler zones: Cold-hardy Prickly Pear (Opuntia humifusa).\n\nAlways check local invasive species lists before planting.\n\n🏜 3. Perfect the Soil Mix\nUse well-draining soil — a cactus/succulent mix or a blend of sand, perlite, and potting soil.\n\nAvoid heavy clay; it traps water and causes root rot.\n\n💧 4. Water Wisely\nFollow the “soak and dry” method: water deeply, then let the soil dry completely.\n\nReduce watering in winter when growth slows.\n\n🌸 5. Add Visual Variety\nMix heights, shapes, and colors for a dynamic display.\n\nCombine tall columnar cacti with round globes and flowering varieties like Echinopsis.\n\n🐝 6. Encourage Pollinators\nFlowering cacti attract bees, butterflies, and hummingbirds.\n\nPlant alongside other drought-tolerant blooms for a pollinator-friendly garden.\n\n🛡 7. Protect from Pests & Rot\nWatch for mealybugs and scale insects; treat early with neem oil or insecticidal soap.\n\nEnsure airflow around plants to prevent fungal issues.\n\n✂️ 8. Maintenance & Styling\nRemove dead flowers and damaged pads to keep plants healthy.\n\nUse decorative gravel or stones to enhance aesthetics and improve drainage.\n\n💡 Pro Tip: For a modern touch, you could design a minimalist cactus garden in raised beds or geometric planters — something that would pair beautifully with your clean, modular design style.\n\nIf you’d like, I can also create a step-by-step cactus garden layout plan with a visual mockup so you can see exactly how to arrange species for maximum impact.\n\nToday\ngive me a proper article about how to care for a cactus\nHere’s a well‑structured, practical guide you can use as a go‑to reference for keeping any cactus healthy and thriving 🌵\n\n🌵 How to Care for a Cactus: The Complete Guide\nCacti are among the most resilient plants on Earth, adapted to survive in some of the harshest environments. Whether you’re growing them indoors as decorative houseplants or outdoors in a garden, the key to success is recreating the conditions they evolved in — bright light, excellent drainage, and minimal water2.\n\n☀️ 1. Light Requirements\nDesert cacti thrive in bright, direct sunlight for 4–6 hours a day. A south‑facing window is ideal indoors.\n\nForest cacti (like holiday cacti) prefer bright, indirect light and can tolerate partial shade.\n\nRotate plants occasionally so all sides receive equal light and avoid leaning or uneven growth.\n\n💧 2. Watering Schedule\nFollow the “soak and dry” method: water thoroughly, then let the soil dry out completely before watering again.\n\nIn summer, watering may be needed weekly; in winter, only every 4–6 weeks as growth slows.\n\nOverwatering is the most common cause of cactus death — soft, mushy stems are a warning sign.\n\n🪴 3. Soil & Potting\nUse a fast‑draining cactus/succulent mix or make your own with potting soil, coarse sand, and perlite.\n\nAlways choose pots with drainage holes to prevent waterlogging.\n\nRepot every 2–3 years or when roots outgrow the container.\n\n🌡 4. Temperature & Humidity\nIdeal range: 65–80°F (18–27°C) with low humidity.\n\nMany cacti can tolerate cooler nights, but avoid frost unless you have a cold‑hardy species.\n\nIn winter dormancy, keep them in a cooler, bright spot and reduce watering\n\n🌸 5. Feeding & Growth\nFertilize during the growing season (spring–summer) with a low‑nitrogen cactus fertilizer every 4–6 weeks.\n\nSkip feeding in winter when the plant is resting.\n\nGrowth is slow — often less than 2.5 cm per year — so patience is key.\n\n\n🛡 6. Common Problems & Solutions\n\nEtiolation (stretching): Not enough light — move to a brighter location.\n\nSunburn: Too much sudden direct sun — acclimate gradually.\n\nPests: Mealybugs and scale insects can be treated with neem oil or insecticidal soap.\n\nRoot rot: Caused by overwatering or poor drainage — remove damaged roots and repot in fresh, dry soil.\n\n\n✂️ 7. Extra Care Tips\nRemove dead flowers and damaged pads to keep plants healthy.\n\nWear gloves when handling spiny varieties.\n\nFor indoor displays, group cacti with similar light and water needs.\n\n', 'Cacti are among the most resilient plants on Earth, adapted to survive in some of the harshest environments. Whether you’re growing them indoors as decorative houseplants or outdoors in a garden, the key to success is recreating the conditions they evolved in — bright light, excellent drainage, and minimal water', 23, 4, 'published', '/uploads/Care.png', NULL, '2025-08-20 14:37:14', '2025-08-20 20:08:44', 0, 0.00, 0, NULL),
(19, 'ffff', 'ddsvevev', 'fffffff', 23, 5, 'published', '', NULL, '2025-08-23 10:53:37', '2025-08-23 10:53:37', 0, 0.00, 0, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `article_categories`
--

CREATE TABLE `article_categories` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `article_categories`
--

INSERT INTO `article_categories` (`id`, `name`, `description`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Uncategorized', 'Default category for articles', 1, '2025-08-20 16:13:18', '2025-08-20 16:13:18'),
(3, 'Gardening Tips', NULL, 1, '2025-08-20 18:19:22', '2025-08-20 18:19:22'),
(4, 'Plant Care', NULL, 1, '2025-08-20 18:19:22', '2025-08-20 18:19:22'),
(5, 'Tools & Equipment', NULL, 1, '2025-08-20 18:19:22', '2025-08-20 18:19:22');

-- --------------------------------------------------------

--
-- Table structure for table `article_comments`
--

CREATE TABLE `article_comments` (
  `id` int(11) NOT NULL,
  `article_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `content` text NOT NULL,
  `status` enum('visible','hidden','pending') DEFAULT 'visible',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `article_ratings`
--

CREATE TABLE `article_ratings` (
  `id` int(11) NOT NULL,
  `article_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `rating` tinyint(1) DEFAULT NULL CHECK (`rating` >= 1 and `rating` <= 5),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cart`
--

CREATE TABLE `cart` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cart`
--

INSERT INTO `cart` (`id`, `user_id`, `product_id`, `quantity`, `created_at`, `updated_at`) VALUES
(15, 8, 2, 1, '2025-08-24 05:23:26', '2025-08-24 05:23:26'),
(16, 8, 3, 2, '2025-08-24 05:23:28', '2025-08-24 06:35:37');

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `description`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Garden Tools', 'Tools for gardening and landscaping', 1, '2025-08-05 21:06:21', '2025-08-05 21:06:21'),
(2, 'Seeds & Plants', 'Seeds, plants, and growing supplies', 1, '2025-08-05 21:06:21', '2025-08-05 21:06:21'),
(3, 'Fertilizers', 'Organic and chemical fertilizers', 1, '2025-08-05 21:06:21', '2025-08-05 21:06:21'),
(4, 'Decorative Items', 'Garden decorations and ornaments', 1, '2025-08-05 21:06:21', '2025-08-05 21:06:21');

-- --------------------------------------------------------

--
-- Table structure for table `order_history`
--

CREATE TABLE `order_history` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'pending',
  `total` decimal(10,2) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_history`
--

INSERT INTO `order_history` (`id`, `user_id`, `status`, `total`, `created_at`, `updated_at`) VALUES
(1, 8, 'completed', 499.99, '2025-08-24 13:42:51', '2025-08-24 21:23:36'),
(2, 1, 'pending', 199.99, '2025-08-24 13:42:51', '2025-08-24 13:42:51');

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `quantity`, `price`) VALUES
(1, 1, 1, 2, 199.99),
(2, 1, 2, 1, 100.01),
(3, 2, 2, 2, 99.99);

-- --------------------------------------------------------

--
-- Table structure for table `permissions`
--

CREATE TABLE `permissions` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `category` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `permissions`
--

INSERT INTO `permissions` (`id`, `name`, `description`, `category`, `created_at`) VALUES
(1, 'manage_users', 'Manage all user accounts and roles', 'user_management', '2025-08-19 06:46:28'),
(2, 'manage_roles', 'Configure user roles and permissions', 'user_management', '2025-08-19 06:46:28'),
(3, 'system_settings', 'Configure system settings', 'system', '2025-08-19 06:46:28'),
(4, 'data_backup', 'Oversee content backups and data integrity', 'system', '2025-08-19 06:46:28'),
(5, 'site_analytics', 'Monitor site-wide metrics', 'analytics', '2025-08-19 06:46:28'),
(6, 'create_articles', 'Create gardening articles and guides', 'content', '2025-08-19 06:46:28'),
(7, 'edit_articles', 'Edit gardening articles and guides', 'content', '2025-08-19 06:46:28'),
(8, 'publish_articles', 'Publish gardening articles and guides', 'content', '2025-08-19 06:46:28'),
(9, 'respond_comments', 'Respond to reader comments', 'content', '2025-08-19 06:46:28'),
(10, 'view_content_analytics', 'View analytics on published content', 'analytics', '2025-08-19 06:46:28'),
(11, 'view_tasks', 'View assigned service-request tasks', 'tasks', '2025-08-19 06:46:28'),
(12, 'accept_tasks', 'Accept assigned service-request tasks', 'tasks', '2025-08-19 06:46:28'),
(13, 'update_task_status', 'Update task status through stages', 'tasks', '2025-08-19 06:46:28'),
(14, 'log_task_notes', 'Log notes and upload photos for tasks', 'tasks', '2025-08-19 06:46:28'),
(15, 'manage_team_members', 'Onboard and manage team members', 'team_management', '2025-08-19 06:46:28'),
(16, 'assign_tasks', 'Assign service requests to team members', 'team_management', '2025-08-19 06:46:28'),
(17, 'set_schedules', 'Set schedules for team members', 'team_management', '2025-08-19 06:46:28'),
(18, 'monitor_progress', 'Monitor task progress and approve reports', 'team_management', '2025-08-19 06:46:28'),
(19, 'generate_payroll', 'Generate payroll reports', 'team_management', '2025-08-19 06:46:28');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) NOT NULL DEFAULT 0.00,
  `category_id` int(11) DEFAULT NULL,
  `sku` varchar(100) DEFAULT NULL,
  `stock_quantity` int(11) DEFAULT 0,
  `image_url` varchar(500) DEFAULT NULL,
  `images` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`images`)),
  `specifications` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`specifications`)),
  `is_active` tinyint(1) DEFAULT 1,
  `is_customizable` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `description`, `price`, `category_id`, `sku`, `stock_quantity`, `image_url`, `images`, `specifications`, `is_active`, `is_customizable`, `created_at`, `updated_at`) VALUES
(1, 'Garden Spade', 'Heavy-duty stainless steel garden spade', 233.00, 1, 'GS001', 50, '/uploads/a.jpeg', NULL, NULL, 1, 0, '2025-08-05 21:06:21', '2025-08-21 21:51:18'),
(2, 'Tomato Seeds', 'Organic heirloom tomato seeds', 5.99, 2, 'TS001', 200, '/uploads/b.jpeg', NULL, NULL, 1, 0, '2025-08-05 21:06:21', '2025-08-21 18:44:56'),
(3, 'Compost Fertilizer', 'Organic compost fertilizer 10kg bag', 19.99, 3, 'CF001', 30, '/uploads/e.jpeg', NULL, NULL, 1, 0, '2025-08-05 21:06:21', '2025-08-21 18:47:35'),
(4, 'Garden Gnome', 'Decorative garden gnome', 39.99, 4, 'GG001', 15, '/uploads/c.jpeg', NULL, NULL, 1, 0, '2025-08-05 21:06:21', '2025-08-21 18:44:27'),
(6, 'Vintage Leather Journal', 'A handcrafted leather-bound journal with recycled paper pages.', 29.99, 2, 'JOURNAL-LTHR-002', 50, '/uploads/d.jpeg', '[\"https://example.com/images/journal1.jpg\", \"https://example.com/images/journal2.jpg\"]', '{\"cover\": \"Genuine leather\", \"pages\": \"100 recycled sheets\", \"size\": \"A5\"}', 1, 0, '2025-08-19 00:39:02', '2025-08-21 18:46:38');

-- --------------------------------------------------------

--
-- Table structure for table `product_images`
--

CREATE TABLE `product_images` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `image_order` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product_images`
--

INSERT INTO `product_images` (`id`, `product_id`, `image_url`, `image_order`) VALUES
(1, 3, '/images/Gb.png', 0),
(2, 3, '/images/Suc.png', 1),
(3, 3, '/images/Suc2.png', 2);

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`, `description`, `created_at`) VALUES
(1, 'administrator', 'Full system access', '2025-08-05 12:09:24'),
(2, 'registered_customer', 'Normal customer account - default for new signups', '2025-08-05 12:09:24'),
(3, 'admin', 'Administrator role', '2025-08-05 19:59:17'),
(4, 'garden_expert', 'Content creator for articles and guides', '2025-08-09 17:07:50'),
(5, 'gardening_team_member', 'Field worker for service requests', '2025-08-19 03:32:39'),
(6, 'gardening_team_manager', 'Manage team members and assign tasks', '2025-08-19 03:32:39');

-- --------------------------------------------------------

--
-- Table structure for table `role_permissions`
--

CREATE TABLE `role_permissions` (
  `id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL,
  `permission_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `role_permissions`
--

INSERT INTO `role_permissions` (`id`, `role_id`, `permission_id`, `created_at`) VALUES
(1, 1, 12, '2025-08-19 06:46:28'),
(2, 1, 16, '2025-08-19 06:46:28'),
(3, 1, 6, '2025-08-19 06:46:28'),
(4, 1, 4, '2025-08-19 06:46:28'),
(5, 1, 7, '2025-08-19 06:46:28'),
(6, 1, 19, '2025-08-19 06:46:28'),
(7, 1, 14, '2025-08-19 06:46:28'),
(8, 1, 2, '2025-08-19 06:46:28'),
(9, 1, 15, '2025-08-19 06:46:28'),
(10, 1, 1, '2025-08-19 06:46:28'),
(11, 1, 18, '2025-08-19 06:46:28'),
(12, 1, 8, '2025-08-19 06:46:28'),
(13, 1, 9, '2025-08-19 06:46:28'),
(14, 1, 17, '2025-08-19 06:46:28'),
(15, 1, 5, '2025-08-19 06:46:28'),
(16, 1, 3, '2025-08-19 06:46:28'),
(17, 1, 13, '2025-08-19 06:46:28'),
(18, 1, 10, '2025-08-19 06:46:28'),
(19, 1, 11, '2025-08-19 06:46:28'),
(32, 4, 6, '2025-08-19 06:46:28'),
(33, 4, 7, '2025-08-19 06:46:28'),
(34, 4, 8, '2025-08-19 06:46:28'),
(35, 4, 9, '2025-08-19 06:46:28'),
(36, 4, 10, '2025-08-19 06:46:28'),
(39, 5, 12, '2025-08-19 06:46:28'),
(40, 5, 14, '2025-08-19 06:46:28'),
(41, 5, 13, '2025-08-19 06:46:28'),
(42, 5, 11, '2025-08-19 06:46:28'),
(46, 6, 12, '2025-08-19 06:46:28'),
(47, 6, 16, '2025-08-19 06:46:28'),
(48, 6, 19, '2025-08-19 06:46:28'),
(49, 6, 14, '2025-08-19 06:46:28'),
(50, 6, 15, '2025-08-19 06:46:28'),
(51, 6, 18, '2025-08-19 06:46:28'),
(52, 6, 17, '2025-08-19 06:46:28'),
(53, 6, 13, '2025-08-19 06:46:28'),
(54, 6, 11, '2025-08-19 06:46:28');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `role_id` int(11) NOT NULL DEFAULT 2,
  `is_active` tinyint(1) DEFAULT 1,
  `email_verified` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `name` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `dob` date DEFAULT NULL,
  `profile_image` varchar(255) DEFAULT NULL,
  `last_login` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `password_hash`, `first_name`, `last_name`, `phone`, `address`, `date_of_birth`, `role_id`, `is_active`, `email_verified`, `created_at`, `updated_at`, `name`, `password`, `dob`, `profile_image`, `last_login`) VALUES
(1, 'admin@bloomingbarrel.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin', 'User', '555-0001', NULL, NULL, 1, 1, 1, '2025-08-05 12:09:24', '2025-08-05 12:09:24', '', '', NULL, NULL, NULL),
(2, 'Kawumaa424@gmail.com', '$2y$10$jyacYjI4SW16/a0KSBkbj.IV98M8bT16NynZd3L4oNPJ4xZkltEZG', 'Kawun', 'Erabadde', '0788949380', '532 colombo ', '2000-12-22', 2, 1, 0, '2025-08-05 12:54:47', '2025-08-19 02:27:39', '', '', NULL, NULL, NULL),
(3, 'Tharushathalpavila48@gmail.com', '$2y$10$ruoT99HaAwsxsybJBvhbIe238xw1GM4eUplwjXgc8ky8bnBSsAOYC', 'Tharusha ', 'Thalpavila', '0715675972', 'E, School Place Girandurukotte', '2002-04-03', 2, 1, 0, '2025-08-05 09:31:48', '2025-08-05 09:31:48', '', '', NULL, NULL, NULL),
(4, 'Tharushathalpavila488@gmail.com', '$2y$10$df5P0GVrp.ut/e7MA5nPbe9OC09lhBRM./WV.tAQHLJtF3Xkml4AK', 'Tharusha ', 'Thalpavila', '0755756666', 'dddddddddd', '2002-12-22', 4, 1, 0, '2025-08-05 09:32:51', '2025-08-09 18:23:36', '', '', NULL, NULL, NULL),
(5, 'Tharushathalpavila58@gmail.com', '$2y$10$mR2kZkFBt5yA4ANOy1YPUu6yhhj0tBwVca64q2lslVPXZIDik1QM2', 'Tharusha ', 'Thalpavila', '0755756666', 'E school Place Girandurukotte', '2002-04-03', 2, 1, 0, '2025-08-05 09:33:23', '2025-08-19 01:02:27', '', '', NULL, NULL, NULL),
(6, 'yuheneraaa@gmail.com', '$2y$10$BrtXUa5e2q4zmPlhOJCSGOjiyYMCxUZkwwxD3Sj4bdIlcFaiaH8LO', 'imalka', 'Yasini', '0755544533', 'dddddddd', '2000-12-22', 2, 1, 0, '2025-08-05 09:34:56', '2025-08-13 13:02:12', '', '', NULL, NULL, NULL),
(8, 'vihithayasini@gmail.com', '$2y$10$Lf3Nfu9xUoSG3OJ5VbRzOuWCm5XfqMF6esYs5aZ0/nCmsY75S34UC', 'Yashiniiiiiiii', 'vihitha', '1113459967', '22/54 Horana ', '2002-11-11', 2, 1, 0, '2025-08-05 09:39:39', '2025-08-24 17:20:35', '', '', NULL, '/uploads/profile_8_1755975990.jpg', '2025-08-24 17:20:35'),
(9, 'admin@bloominbarrels.com', '$2y$10$Cd2U1LJmFYq1htBTylWyhuDV/Tlg8SICk3XDBKezq9HlkytIr9t1G', 'Admin', 'User', NULL, NULL, NULL, 3, 1, 1, '2025-08-05 19:59:51', '2025-08-23 16:20:58', '', '$2y$10$8QnZza1iH9m2tgcAgwWfaekstTNbbCzVgsXeNHGI0tflfRexPb1pu', NULL, NULL, '2025-08-23 16:20:58'),
(10, 'Hansanath24@gmail.com', '', '', '', '0712345678', 'Mudduwa ,Rathnapura', NULL, 4, 1, 0, '2025-08-12 09:30:48', '2025-08-12 09:30:48', 'Hansanath', '$2y$10$hbeObSI9qyeoAXzw.GeFjenhCpGiYqrForXy8MHZ1lT0aJ.tgL0nq', '2002-12-12', NULL, NULL),
(11, 'tutu@gmail.com', '', 'Tutu', 'ten', NULL, NULL, NULL, 2, 1, 0, '2025-08-13 09:59:21', '2025-08-19 17:28:22', 'Admin User', '$2y$10$FqFKg7Eb4jTo3kpChJWGoe8ybinY.9UGr4Zva/YwdaC6.q3uQRMLW', NULL, NULL, '2025-08-18 13:12:30'),
(12, 'test@example.com', '$2y$10$VLkhjaBnr6z/3K3f/AP3KuPFDiNY4iv39qV1o//ba8Z4Cw2dBFLAa', 'Test', 'User', NULL, NULL, NULL, 2, 0, 0, '2025-08-18 15:29:24', '2025-08-19 01:05:04', 'Test User', '$2y$10$XFr1Qzv7DT2vvkxVyXWGeeQhZ6Zv24Osj23S.l21Ol32WwONWPPsO', NULL, NULL, NULL),
(13, 'admin@example.com', '$2y$10$SmbxJv7KhcKKsy96ol.ituCsYqnSCRXcLlnHCOE.z.Q.xhwxCkiXO', 'Admin', 'User', NULL, NULL, NULL, 2, 1, 0, '2025-08-18 15:29:24', '2025-08-19 17:25:38', 'Admin User', '$2y$10$EnBn/v.Gzes0ABNfazpafOtMB.emmuM2u3IJXdi4uVyf09MyTeSoy', NULL, NULL, NULL),
(14, 'iit22064@std.uwu.ac.lk', '$2y$10$AJjra0P5bz4OsGlhmOgYX.jb2F.nHt4hYmiHRCD8fAZu9rzl.xmXa', 'John', 'doe', '1234567890', '123 main strt', '2000-05-03', 2, 0, 0, '2025-08-18 17:44:55', '2025-08-19 01:04:40', '', '', NULL, NULL, NULL),
(15, 'Pawani532@gmail.com', '$2y$10$5wGAjo9HHo.V9ydfqseBge3hnmzcNDoWRC5ICg2vd8Jhmcm86avaG', 'Pawani', 'nanayakkare', '0789788889', '123 Sapugaskanda ', '2002-04-03', 2, 1, 0, '2025-08-19 00:29:48', '2025-08-19 17:53:08', '', '', NULL, NULL, NULL),
(16, 'NimeshEranda@gmail.com', '$2y$10$hayaDFR08PuH1dC.BP6wluIKk5uLePIivsJRlpNjUALm7sCJ3BtEq', 'Nimesh', 'Eranda', '1234567890', '12/2 Middle Class', NULL, 2, 1, 1, '2025-08-19 18:47:28', '2025-08-19 19:21:24', '', '', NULL, NULL, '2025-08-19 19:21:24'),
(17, 'tema@gmail.com', '$2y$10$Gwa0lEMaoNGWiMD6OhPDK.QH2z3VJ16q8yizy0ZnCIxl.U/KRzmWa', 'huka', 'paka', '0994545345', 'weee', NULL, 2, 1, 1, '2025-08-19 19:24:46', '2025-08-19 19:24:46', '', '', NULL, NULL, NULL),
(18, 'hukapaka@gmail.com', '$2y$10$TFUIN.pcyi1wZ8qPYrbDbeDrJJo5Q7w/8QY7u7krDdLzLDO2KHvd.', 'huka', 'paka', '1234567890', 'wertt', NULL, 2, 1, 1, '2025-08-19 20:05:08', '2025-08-19 20:19:28', '', '', NULL, NULL, '2025-08-19 20:19:28'),
(20, 'huththi@gmail.com', '$2y$10$YVwhlUK4cJ64M0v67lcoReHdpIAZxR7DOv4v91yq3K1po9evkAkj2', 'hyyy', 'rrrr', '1234567890', 'rrttt', NULL, 2, 1, 1, '2025-08-19 20:39:31', '2025-08-19 20:39:31', '', '', NULL, NULL, NULL),
(23, 'iit220633333@std.uwu.ac.lk', '$2y$10$Ij8XRitz14kvddQbpBmWHuRD/2Fgcontj/gqC.vJn/WnDDAhFgRAW', 'iit', 'std', '1234567890', '12/2 Middle Class HSG', NULL, 4, 1, 1, '2025-08-20 02:27:41', '2025-08-23 16:23:25', '', '', NULL, NULL, '2025-08-23 16:23:25');

-- --------------------------------------------------------

--
-- Table structure for table `wishlist`
--

CREATE TABLE `wishlist` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `wishlist`
--

INSERT INTO `wishlist` (`id`, `user_id`, `product_id`, `created_at`) VALUES
(24, 8, 1, '2025-08-23 12:36:48'),
(26, 8, 3, '2025-08-23 12:36:50'),
(27, 8, 4, '2025-08-23 12:36:51');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `articles`
--
ALTER TABLE `articles`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_author` (`author_id`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_publish_date` (`publish_date`),
  ADD KEY `fk_article_category` (`category_id`);

--
-- Indexes for table `article_categories`
--
ALTER TABLE `article_categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `article_comments`
--
ALTER TABLE `article_comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_article_comments_article` (`article_id`),
  ADD KEY `idx_article_comments_user` (`user_id`),
  ADD KEY `idx_article_comments_parent` (`parent_id`);

--
-- Indexes for table `article_ratings`
--
ALTER TABLE `article_ratings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_article` (`article_id`,`user_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `idx_article_ratings_article` (`article_id`);

--
-- Indexes for table `cart`
--
ALTER TABLE `cart`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_cart_user` (`user_id`),
  ADD KEY `idx_cart_product` (`product_id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `order_history`
--
ALTER TABLE `order_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `permissions`
--
ALTER TABLE `permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `sku` (`sku`);

--
-- Indexes for table `product_images`
--
ALTER TABLE `product_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `role_permissions`
--
ALTER TABLE `role_permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_role_permission` (`role_id`,`permission_id`),
  ADD KEY `permission_id` (`permission_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_email` (`email`),
  ADD KEY `idx_role` (`role_id`);

--
-- Indexes for table `wishlist`
--
ALTER TABLE `wishlist`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_product_wishlist` (`user_id`,`product_id`),
  ADD KEY `idx_wishlist_user` (`user_id`),
  ADD KEY `idx_wishlist_product` (`product_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `articles`
--
ALTER TABLE `articles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `article_categories`
--
ALTER TABLE `article_categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `article_comments`
--
ALTER TABLE `article_comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `article_ratings`
--
ALTER TABLE `article_ratings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `cart`
--
ALTER TABLE `cart`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `order_history`
--
ALTER TABLE `order_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `permissions`
--
ALTER TABLE `permissions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `product_images`
--
ALTER TABLE `product_images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `role_permissions`
--
ALTER TABLE `role_permissions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=60;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `wishlist`
--
ALTER TABLE `wishlist`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `articles`
--
ALTER TABLE `articles`
  ADD CONSTRAINT `articles_ibfk_1` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `fk_article_category` FOREIGN KEY (`category_id`) REFERENCES `article_categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `article_comments`
--
ALTER TABLE `article_comments`
  ADD CONSTRAINT `article_comments_ibfk_1` FOREIGN KEY (`article_id`) REFERENCES `articles` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `article_comments_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `article_comments_ibfk_3` FOREIGN KEY (`parent_id`) REFERENCES `article_comments` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `article_ratings`
--
ALTER TABLE `article_ratings`
  ADD CONSTRAINT `article_ratings_ibfk_1` FOREIGN KEY (`article_id`) REFERENCES `articles` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `article_ratings_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `cart`
--
ALTER TABLE `cart`
  ADD CONSTRAINT `cart_fk_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `cart_fk_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `order_history`
--
ALTER TABLE `order_history`
  ADD CONSTRAINT `order_history_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `order_history` (`id`),
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

--
-- Constraints for table `product_images`
--
ALTER TABLE `product_images`
  ADD CONSTRAINT `product_images_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `role_permissions`
--
ALTER TABLE `role_permissions`
  ADD CONSTRAINT `role_permissions_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `role_permissions_ibfk_2` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`);

--
-- Constraints for table `wishlist`
--
ALTER TABLE `wishlist`
  ADD CONSTRAINT `wishlist_fk_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `wishlist_fk_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
