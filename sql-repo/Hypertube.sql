--Create table first
CREATE DATABASE Hypertube;

--Create Table
CREATE TABLE Users(
    UserID BIGINT AUTO_INCREMENT PRIMARY KEY,
    FirstName VARCHAR(100),
    LastName VARCHAR(100),
    Username VARCHAR(100) UNIQUE, 
    EmailAddress VARCHAR(100) UNIQUE,
    Passcode VARCHAR(150),
    CustomHash VARCHAR(200),
    Active INT,
    IntraID VARCHAR(50) UNIQUE
    ); 