# Deprivation and Education Tracker

## Project Description

This application provides data about education levels for specific LSOAs, as well as their Index of Multiple Deprivation Deciles.
The user can choose to select the LSOA in different ways, or to select to view data about a certain IMD Decile.

## Core Technologies

### Backend
Backend is built using Node.js and Express.
MySQL is used for communicating with the database, while Sequelize (an Object-Relational Mapper) is used for managing the queries.
Inversify and Relfect-metadata have been used to expand the MVC model to include containers, which improves the scalability of the project.

### Frontend
The package d3.js is used for data visualisation. It is a JS library which can create dynamic visualisations in the web browser.

## How to Use

The user is presented with an interface containing input fields, some information, a map, and a list of LSOAs.
The user can input a known LSOA code into the input field, and a graph of the education levels will be displayed. The user can then elect to compare this information with the mean values for all LSOAs within the given decile.
THe user can also choose to zoom in on the map to find the LSOA of interest, or use the list which can be filtered by typing in the field.

The user can also choose to view just the mean data for any given decile, which can be helpful for making general statements about education levels in different socio-economic areas. 

## Link to the Deployed Application

Include a link to the deployed application. The application should be hosted on a platform that allows public access.

## Additional features

Explain how you have addressed the assignment requirements. If you've added any custom functionality, discuss them in this section and link to the specific issues you have closed.

## Acknowledgements

Include a list of resources you found helpful, attributions, or shoutouts here.