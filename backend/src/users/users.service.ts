import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Doctor } from './entities/doctor.entity';
import { Patient } from './entities/patient.entity';
import { Admin } from './entities/admin.entity';
import { Receptionist } from './entities/receptioniste.entity';
import { userRole } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Admin) private readonly adminRepo: Repository<Admin>,
    @InjectRepository(Receptionist)
    private readonly recepRepo: Repository<Receptionist>,
    @InjectRepository(Patient)
    private readonly patientRepo: Repository<Patient>,
    @InjectRepository(Doctor) private readonly doctorRepo: Repository<Doctor>,
  ) { }

  async getUsers(role?: userRole, ids?: string[]) {
    const where = ids ? { id: In(ids) } : {};
    
    if (role === userRole.ADMIN || role === userRole.SUPER_ADMIN)
      return this.adminRepo.find({ where });
    if (role === userRole.RECEP) 
      return this.recepRepo.find({ where, relations: { clinique: true } });
    if (role === userRole.PATIENT) 
      return this.patientRepo.find({ where });
    if (role === userRole.DOCTOR) 
      return this.doctorRepo.find({ 
        where, 
        relations: { clinique: true }
      });
    
    return [
      ...(await this.adminRepo.find({ where })),
      ...(await this.recepRepo.find({ where })),
      ...(await this.patientRepo.find({ where })),
      ...(await this.doctorRepo.find({ 
        where, 
        relations: { clinique: true }
      })),
    ];
  }

  async createReceptionist(userDto: CreateUserDto) {
    const existed = await this.recepRepo.existsBy([
      { email: userDto.email },
      { phone: userDto.phone },
    ]);
    if (existed) {
      throw new ConflictException(
        'User with this email or phone number already exists',
      );
    }
    const receptionist = new Receptionist();
    receptionist.firstName = userDto.firstName;
    receptionist.lastName = userDto.lastName;
    receptionist.email = userDto.email;
    receptionist.phone = userDto.phone;
    receptionist.password = userDto.password;
    receptionist.role = userRole.RECEP;
    
    return await this.recepRepo.save(receptionist);
  }

  async createPatient(userDto: CreateUserDto) {
    const existed = await this.patientRepo.existsBy([
      { email: userDto.email },
      { phone: userDto.phone },
    ]);
    if (existed) {
      throw new ConflictException(
        'User with this email or phone number already exists',
      );
    }
    const patient = new Patient();
    patient.firstName = userDto.firstName;
    patient.lastName = userDto.lastName;
    patient.email = userDto.email;
    patient.phone = userDto.phone;
    patient.password = userDto.password;
    patient.role = userRole.PATIENT;
    
    return await this.patientRepo.save(patient);
  }

  async createAdmin(userDto: CreateUserDto) {
    const existed = await this.adminRepo.existsBy([
      { email: userDto.email },
      { phone: userDto.phone },
    ]);
    if (existed) {
      throw new ConflictException(
        'User with this email or phone number already exists',
      );
    }
    const admin = new Admin();
    admin.firstName = userDto.firstName;
    admin.lastName = userDto.lastName;
    admin.email = userDto.email;
    admin.phone = userDto.phone;
    admin.password = userDto.password;
    admin.role = userRole.ADMIN;
    
    return await this.adminRepo.save(admin);
  }

  async createDoctor(userDto: CreateUserDto) {
    const existed = await this.doctorRepo.existsBy([
      { email: userDto.email },
      { phone: userDto.phone },
    ]);
    if (existed) {
      throw new ConflictException(
        'User with this email or phone number already exists',
      );
    }
    
    const doctor = new Doctor();
    doctor.firstName = userDto.firstName;
    doctor.lastName = userDto.lastName;
    doctor.email = userDto.email;
    doctor.phone = userDto.phone;
    doctor.password = userDto.password;
    doctor.role = userRole.DOCTOR;
    doctor.speciality = userDto.speciality || '';
    
    return await this.doctorRepo.save(doctor);
  }

  async findByEmail(email: string) {
    let user = await this.adminRepo.findOne({ where: { email } });
    user ??= await this.recepRepo.findOne({ where: { email } });
    user ??= await this.patientRepo.findOne({ where: { email } });
    user ??= await this.doctorRepo.findOne({ 
      where: { email },
      relations: { clinique: true }
    });
    
    if (!user) {
      throw new NotFoundException(`User with this email does not exist`);
    }
    return user;
  }

  async findUserByIdWithoutRole(id: string) {
    let user = await this.adminRepo.findOne({ where: { id } });
    user ??= await this.recepRepo.findOne({ where: { id } });
    user ??= await this.patientRepo.findOne({ where: { id } });
    user ??= await this.doctorRepo.findOne({ 
      where: { id },
      relations: { clinique: true }
    });
    
    if (!user) {
      throw new NotFoundException(`User with this id does not exist`);
    }
    return user;
  }

  async findUserById(id: string, role: userRole) {
    let user: Admin | Receptionist | Patient | Doctor | null = null;
    
    if (role === userRole.ADMIN || role === userRole.SUPER_ADMIN)
      user = await this.adminRepo.findOne({ where: { id } });
    else if (role === userRole.RECEP)
      user = await this.recepRepo.findOne({ where: { id }, relations: { clinique: true } });
    else if (role === userRole.PATIENT)
      user = await this.patientRepo.findOne({ where: { id } });
    else if (role === userRole.DOCTOR)
      user = await this.doctorRepo.findOne({ 
        where: { id }, 
        relations: { clinique: true }
      });
    
    if (!user)
      throw new NotFoundException(`${role} with this id does not exist`);
    return user;
  }

  async deleteUserById(id: string, role: userRole) {
    await this.findUserById(id, role);
    let result;
    
    if (role === userRole.ADMIN || role === userRole.SUPER_ADMIN)
      result = await this.adminRepo.delete(id);
    else if (role === userRole.RECEP) 
      result = await this.recepRepo.delete(id);
    else if (role === userRole.PATIENT) 
      result = await this.patientRepo.delete(id);
    else if (role === userRole.DOCTOR) 
      result = await this.doctorRepo.delete(id);
    
    if (result?.affected === 0)
      throw new NotFoundException('User with this id does not exist');
    return { message: `${role} deleted successfully` };
  }

  async assignClinicToDoctor(userId: string) {
    const user = await this.findUserByIdWithoutRole(userId) as Doctor;
  }

  async assignClinicToReceptioniste(userId: string) {
    const user = await this.findUserByIdWithoutRole(userId) as Receptionist;
  }

  async findUserProfile(id: string) {
    console.log('🔍 Recherche du profil utilisateur ID:', id);
    
    let user = await this.adminRepo.findOne({ 
      where: { id }
    });
    
    if (!user) {
      user = await this.recepRepo.findOne({ 
        where: { id }
      });
    }
    
    if (!user) {
      user = await this.patientRepo.findOne({ 
        where: { id }
      });
    }
    
    if (!user) {
      user = await this.doctorRepo.findOne({ 
        where: { id }
      });
    }
    
    if (!user) {
      console.error('❌ Utilisateur non trouvé avec ID:', id);
      throw new NotFoundException(`User with id ${id} does not exist`);
    }
    
    console.log('✅ Profil utilisateur trouvé:', {
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      role: user.role
    });
    
    return user;
  }
}