CREATE TABLE `med-equipments`.`suppliers`  (
  `supplier_ID` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NULL,
  `phone` int(20) NULL,
  `address` varchar(255) NULL,
  `supplier_status` tinyint(1) NULL DEFAULT 1,
  PRIMARY KEY (`supplier_ID`)
);

INSERT INTO suppliers (name) select DISTINCT supplier from equipments;

ALTER TABLE `med-equipments`.`equipments` ADD COLUMN `supplier_ID_FK` int(11) NULL AFTER `ppm_done`;


update equipments set supplier_ID_FK = (select supplier_ID from suppliers where equipments.supplier = suppliers.name);

ALTER TABLE `med-equipments`.`equipments` DROP COLUMN `supplier`;