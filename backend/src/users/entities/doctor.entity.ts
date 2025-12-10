import { Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany, Column } from "typeorm";
import { User } from "./user.entity";
import { Clinique } from "src/clinique/entities/clinique.entity";
import { Appointment } from "src/agenda/entities/appointment.entity";

@Entity()
export class Doctor extends User { 
    @ManyToOne(() => Clinique, (clinique) => clinique.doctors)
    clinique: Clinique;

    @OneToMany(() => Appointment, appointment => appointment.doctor)
    appointments: Appointment[];

    @Column({ nullable: true, default: '' })
    speciality: string;
}