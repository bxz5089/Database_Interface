INSERT INTO department (name)
VALUES ("Sales"),
       ("Engineering"),
       ("Finance"),
       ("Legal");
       
INSERT INTO role (title,salary,department_id)
VALUES ("Sales Lead",100000,1),
       ("Salesperson",60000,1),
       ("Lead Engineer",200000,2),
       ("Software Engineer",100000,2),
       ("Account Manager",150000,3),
       ("Accountant",80000,3),
       ("Legal Team Lead",250000,4),
       ("Lawyer",180000,4);
       
INSERT INTO employee (first_name,last_name,role_id,manager_id)
VALUES ("John","Doe",1,null),
       ("John","Do",2,1),
       ("John","Did",3,null),
       ("John","Done",4,2),
       ("John","Drive",5,null),
       ("John","Dive",6,3),
       ("John","Died",7,null),
       ("John","Dance",8,4);
