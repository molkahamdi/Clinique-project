import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { TimeStamEntity } from "src/database/timestamp-entity";
import { Appointment } from "src/appointments/entities/appointment.entity";

@Entity("invoices")
export class Invoice extends TimeStamEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  invoiceNumber: string;

  @Column({ type: "date" })
  invoiceDate: string;

  @Column({ type: "float" })
  consultationFee: number;

  @Column({ type: "float" })
  tax: number;

  @Column({ type: "float" })
  totalFinal: number;

  @Column({ nullable: true })
  paymentMethod: string;

  @Column({ nullable: true })
  notes: string;

  @ManyToOne(() => Appointment, (appt) => appt.invoices, { onDelete: "CASCADE" })
  appointment: Appointment;
}
