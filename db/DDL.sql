-- phpMyAdmin SQL Dump
-- version 4.7.1
-- https://www.phpmyadmin.net/
--
-- Host: sql9.freemysqlhosting.net
-- Generation Time: Nov 24, 2020 at 07:10 PM
-- Server version: 5.5.62-0ubuntu0.14.04.1
-- PHP Version: 7.0.33-0ubuntu0.16.04.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sql9354626`
--

-- --------------------------------------------------------

--
-- Table structure for table `Books`
--

CREATE TABLE `Books` (
  `ID` int(255) NOT NULL,
  `Name` varchar(255) NOT NULL,
  `UserID` int(8) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Books`
--

INSERT INTO `Books` (`ID`, `Name`, `UserID`) VALUES
(1, 'My first book', 3),
(5, 'second book', 3),
(6, 'my very third book', 3),
(7, 'Show the group', 3),
(8, 'Cookies!', 3),
(12, 'Chicken Recipes', 3);

-- --------------------------------------------------------

--
-- Table structure for table `Ingredient`
--

CREATE TABLE `Ingredient` (
  `ID` int(8) NOT NULL,
  `Name` varchar(255) NOT NULL,
  `IsEthical` tinyint(1) NOT NULL,
  `EthicalDescription` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Ingredient`
--

INSERT INTO `Ingredient` (`ID`, `Name`, `IsEthical`, `EthicalDescription`) VALUES
(1, 'Carrot', 0, 'Carrot root fly pest on carrots can lead to overuse of pesticides.'),
(2, 'Cage Raised Chicken', 0, 'Poor chicken raising practices'),
(3, 'Free Range Chicken', 1, 'Good chicken raising practices'),
(4, 'Honey', 1, 'When raised with proper care, bee colonies may be beneficial to pollinization of nearby flora.'),
(5, 'Mayonnaise', 0, 'Possible that eggs used were not ethically sourced; i.e., the chickens were not farm raised'),
(6, 'Bread', 0, 'Wheat cultivation for breads may result in over-fertilization, leading to nitrate leaching in the soil and nearby water bodies.'),
(7, 'Wakame Seaweed', 1, 'No use of pesticides'),
(8, 'Rice', 0, 'Water intensive crop. Aquatic bacteria in rice fields also emit the greenhouse gases, methane and nitrous oxide into the atmosphere.'),
(9, 'Buckwheat', 1, 'It is a short season crop, maturing in just eight to twelve weeks, and grows well in both acidic and under fertilized soils. It can also be used as a ‘cover crop’ or ‘smother crop’ to help keep weeds down and reduce soil erosion while fields rest during crop rotation. ');

-- --------------------------------------------------------

--
-- Table structure for table `IngredientGroup`
--

CREATE TABLE `IngredientGroup` (
  `ID` int(8) NOT NULL,
  `GroupName` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `IngredientGroup`
--

INSERT INTO `IngredientGroup` (`ID`, `GroupName`) VALUES
(1, 'Vegetable'),
(2, 'Protein'),
(3, 'Meat'),
(4, 'Grain'),
(5, 'Condiment');

-- --------------------------------------------------------

--
-- Table structure for table `Ingredient_IngredientGroup`
--

CREATE TABLE `Ingredient_IngredientGroup` (
  `ID` int(8) NOT NULL,
  `IngredientID` int(8) NOT NULL,
  `IngredientGroupID` int(8) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Ingredient_IngredientGroup`
--

INSERT INTO `Ingredient_IngredientGroup` (`ID`, `IngredientID`, `IngredientGroupID`) VALUES
(7, 1, 1),
(8, 7, 1),
(9, 2, 3),
(10, 3, 3),
(11, 4, 5),
(12, 5, 5),
(13, 6, 4),
(14, 8, 4),
(15, 9, 4),
(16, 2, 2),
(17, 3, 2);

-- --------------------------------------------------------

--
-- Table structure for table `Recipe`
--

CREATE TABLE `Recipe` (
  `ID` int(8) NOT NULL,
  `Name` varchar(255) NOT NULL,
  `Description` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Recipe`
--

INSERT INTO `Recipe` (`ID`, `Name`, `Description`) VALUES
(12, 'Chicken and Rice', 'Simple meal consisting of chicken, rice, and carrot. Very easy to make.'),
(13, 'Chicken Sandwich', 'Really easy chicken sandwich. No veggies necessary.'),
(14, 'Salad', 'Carrot and seaweed salad. Yum.');

-- --------------------------------------------------------

--
-- Table structure for table `RecipeComponent`
--

CREATE TABLE `RecipeComponent` (
  `ID` int(8) NOT NULL,
  `IngredientID` int(8) NOT NULL,
  `Amount` double NOT NULL,
  `MeasurementType` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `RecipeComponent`
--

INSERT INTO `RecipeComponent` (`ID`, `IngredientID`, `Amount`, `MeasurementType`) VALUES
(16, 8, 1, 'cup'),
(17, 3, 0.5, 'lbs'),
(18, 1, 2, 'g'),
(19, 5, 1, 'tbsp'),
(20, 3, 1, 'lb'),
(21, 6, 2, 'slices'),
(22, 1, 2, 'lbs'),
(23, 7, 2, 'kg');

-- --------------------------------------------------------

--
-- Table structure for table `Recipes_Books`
--

CREATE TABLE `Recipes_Books` (
  `ID` int(255) NOT NULL,
  `BookID` int(255) NOT NULL,
  `RecipeID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Recipes_Books`
--

INSERT INTO `Recipes_Books` (`ID`, `BookID`, `RecipeID`) VALUES
(2, 12, 12),
(3, 12, 13);

-- --------------------------------------------------------

--
-- Table structure for table `Recipes_Users`
--

CREATE TABLE `Recipes_Users` (
  `ID` int(8) NOT NULL,
  `RecipeID` int(8) NOT NULL,
  `UserID` int(8) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Recipes_Users`
--

INSERT INTO `Recipes_Users` (`ID`, `RecipeID`, `UserID`) VALUES
(11, 12, 3),
(12, 13, 3),
(13, 14, 3);

-- --------------------------------------------------------

--
-- Table structure for table `Recipe_RecipeComponent`
--

CREATE TABLE `Recipe_RecipeComponent` (
  `ID` int(8) NOT NULL,
  `RecipeID` int(8) NOT NULL,
  `RecipeComponentID` int(8) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Recipe_RecipeComponent`
--

INSERT INTO `Recipe_RecipeComponent` (`ID`, `RecipeID`, `RecipeComponentID`) VALUES
(16, 12, 16),
(17, 12, 17),
(18, 12, 18),
(19, 13, 19),
(20, 13, 20),
(21, 13, 21),
(22, 14, 22),
(23, 14, 23);

-- --------------------------------------------------------

--
-- Table structure for table `Users`
--

CREATE TABLE `Users` (
  `ID` int(8) NOT NULL,
  `username` varchar(16) NOT NULL,
  `password` varchar(128) NOT NULL,
  `nickname` varchar(128) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Users`
--

INSERT INTO `Users` (`ID`, `username`, `password`, `nickname`) VALUES
(1, 'johndoe', '0x$2b$10$fbFruwqEPOKiRz1VBxazKO9InLlaUaIU1vVxLiKX.cCM4pwCEoftW', 'John Doe'),
(2, 'janedoe', '0x$2b$10$fbFruwqEPOKiRz1VBxazKO9InLlaUaIU1vVxLiKX.cCM4pwCEoftW', NULL),
(3, 'Testus2', '6eda13efe1a69db8d7fa7c7d543ef9a5', ''),
(4, 'Testus1', '6eda13efe1a69db8d7fa7c7d543ef9a5', 'tiff');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Books`
--
ALTER TABLE `Books`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `UserID` (`UserID`) USING BTREE;

--
-- Indexes for table `Ingredient`
--
ALTER TABLE `Ingredient`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `IngredientGroup`
--
ALTER TABLE `IngredientGroup`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `Ingredient_IngredientGroup`
--
ALTER TABLE `Ingredient_IngredientGroup`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `IngredientID` (`IngredientID`),
  ADD KEY `IngredientGroupID` (`IngredientGroupID`);

--
-- Indexes for table `Recipe`
--
ALTER TABLE `Recipe`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `RecipeComponent`
--
ALTER TABLE `RecipeComponent`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `IngredientID` (`IngredientID`);

--
-- Indexes for table `Recipes_Books`
--
ALTER TABLE `Recipes_Books`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `BookID` (`BookID`),
  ADD KEY `RecipeID` (`RecipeID`);

--
-- Indexes for table `Recipes_Users`
--
ALTER TABLE `Recipes_Users`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `RecipeID` (`RecipeID`),
  ADD KEY `UserID` (`UserID`);

--
-- Indexes for table `Recipe_RecipeComponent`
--
ALTER TABLE `Recipe_RecipeComponent`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `RecipeID` (`RecipeID`),
  ADD KEY `RecipeComponentID` (`RecipeComponentID`);

--
-- Indexes for table `Users`
--
ALTER TABLE `Users`
  ADD PRIMARY KEY (`ID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Books`
--
ALTER TABLE `Books`
  MODIFY `ID` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;
--
-- AUTO_INCREMENT for table `Ingredient`
--
ALTER TABLE `Ingredient`
  MODIFY `ID` int(8) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;
--
-- AUTO_INCREMENT for table `IngredientGroup`
--
ALTER TABLE `IngredientGroup`
  MODIFY `ID` int(8) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
--
-- AUTO_INCREMENT for table `Ingredient_IngredientGroup`
--
ALTER TABLE `Ingredient_IngredientGroup`
  MODIFY `ID` int(8) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;
--
-- AUTO_INCREMENT for table `Recipe`
--
ALTER TABLE `Recipe`
  MODIFY `ID` int(8) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;
--
-- AUTO_INCREMENT for table `RecipeComponent`
--
ALTER TABLE `RecipeComponent`
  MODIFY `ID` int(8) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;
--
-- AUTO_INCREMENT for table `Recipes_Books`
--
ALTER TABLE `Recipes_Books`
  MODIFY `ID` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT for table `Recipes_Users`
--
ALTER TABLE `Recipes_Users`
  MODIFY `ID` int(8) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;
--
-- AUTO_INCREMENT for table `Recipe_RecipeComponent`
--
ALTER TABLE `Recipe_RecipeComponent`
  MODIFY `ID` int(8) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;
--
-- AUTO_INCREMENT for table `Users`
--
ALTER TABLE `Users`
  MODIFY `ID` int(8) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `Books`
--
ALTER TABLE `Books`
  ADD CONSTRAINT `Books_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `Users` (`ID`);

--
-- Constraints for table `Ingredient_IngredientGroup`
--
ALTER TABLE `Ingredient_IngredientGroup`
  ADD CONSTRAINT `Ingredient_IngredientGroup_ibfk_1` FOREIGN KEY (`IngredientID`) REFERENCES `Ingredient` (`ID`),
  ADD CONSTRAINT `Ingredient_IngredientGroup_ibfk_2` FOREIGN KEY (`IngredientGroupID`) REFERENCES `IngredientGroup` (`ID`);

--
-- Constraints for table `RecipeComponent`
--
ALTER TABLE `RecipeComponent`
  ADD CONSTRAINT `RecipeComponent_ibfk_1` FOREIGN KEY (`IngredientID`) REFERENCES `Ingredient` (`ID`),
  ADD CONSTRAINT `RecipeComponent_ibfk_2` FOREIGN KEY (`IngredientID`) REFERENCES `Ingredient` (`ID`);

--
-- Constraints for table `Recipes_Books`
--
ALTER TABLE `Recipes_Books`
  ADD CONSTRAINT `Recipes_Books_ibfk_1` FOREIGN KEY (`RecipeID`) REFERENCES `Recipe` (`ID`),
  ADD CONSTRAINT `Recipes_Books_ibfk_2` FOREIGN KEY (`BookID`) REFERENCES `Books` (`ID`);

--
-- Constraints for table `Recipes_Users`
--
ALTER TABLE `Recipes_Users`
  ADD CONSTRAINT `Recipes_Users_ibfk_1` FOREIGN KEY (`RecipeID`) REFERENCES `Recipe` (`ID`),
  ADD CONSTRAINT `Recipes_Users_ibfk_2` FOREIGN KEY (`UserID`) REFERENCES `Users` (`ID`);

--
-- Constraints for table `Recipe_RecipeComponent`
--
ALTER TABLE `Recipe_RecipeComponent`
  ADD CONSTRAINT `Recipe_RecipeComponent_ibfk_1` FOREIGN KEY (`RecipeID`) REFERENCES `Recipe` (`ID`),
  ADD CONSTRAINT `Recipe_RecipeComponent_ibfk_2` FOREIGN KEY (`RecipeComponentID`) REFERENCES `RecipeComponent` (`ID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
