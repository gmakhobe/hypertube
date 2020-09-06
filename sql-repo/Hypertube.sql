--Create table first
CREATE DATABASE HypertubeApp;

--Create Table
CREATE TABLE `Users` (
  `UserID` bigint(20) NOT NULL,
  `FirstName` varchar(100) DEFAULT NULL,
  `LastName` varchar(100) DEFAULT NULL,
  `Username` varchar(100) DEFAULT NULL,
  `EmailAddress` varchar(100) DEFAULT NULL,
  `Passcode` varchar(150) DEFAULT NULL,
  `CustomHash` varchar(200) DEFAULT NULL,
  `Active` int(11) DEFAULT NULL,
  `IntraID` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Indexes for table `Users`
--
ALTER TABLE `Users`
  ADD PRIMARY KEY (`UserID`),
  ADD UNIQUE KEY `Username` (`Username`),
  ADD UNIQUE KEY `EmailAddress` (`EmailAddress`),
  ADD UNIQUE KEY `IntraID` (`IntraID`);


