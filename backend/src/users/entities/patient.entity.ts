import { Column, Entity, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Appointment } from 'src/appointments/entities/appointment.entity';

@Entity()
export class Patient extends User {
  @Column({ name: 'date_of_birth', type: 'date', nullable: true })
  dateOfBirth: Date;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  bloodType: string;

  @OneToMany(() => Appointment, appointment => appointment.patient)
  appointments: Appointment[];
}