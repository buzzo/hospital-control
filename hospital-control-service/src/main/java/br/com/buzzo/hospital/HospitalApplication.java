package br.com.buzzo.hospital;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import br.com.buzzo.hospital.patient.Patient;
import br.com.buzzo.hospital.patient.PatientEndPoint;

@SpringBootApplication
public class HospitalApplication implements CommandLineRunner {

	@Autowired
	private PatientEndPoint patientEP;

	public static void main(String[] args) {
		SpringApplication.run(HospitalApplication.class, args);
	}

	@Override
	public void run(String... arg0) throws Exception {
		patientEP.add(new Patient(0, "patient1", "+1 433 2133", new Date(),
				"notes1"));
	}

}
