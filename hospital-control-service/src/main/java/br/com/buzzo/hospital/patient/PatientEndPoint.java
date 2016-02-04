package br.com.buzzo.hospital.patient;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/patient")
public class PatientEndPoint {

	private static List<Patient> patients = new ArrayList<>();
	private static int id = 1;

	@RequestMapping(method = RequestMethod.GET)
	public List<Patient> getAll() {
		return patients;
	}

	@RequestMapping(value = "/{id}", method = RequestMethod.GET)
	public Patient get(@PathVariable int id) {
		return find(id);
	}

	@RequestMapping(method = RequestMethod.POST)
	public void add(final @RequestBody Patient patient) {
		patient.setId(id++);
		patients.add(patient);
	}

	@RequestMapping(value = "/{id}", method = RequestMethod.PUT)
	public void put(final @RequestBody Patient patient, @PathVariable int id) {
		final Patient patientFound = find(id);
		if (patientFound != null) {
			// replace
			PatientEndPoint.patients.remove(patientFound);
			PatientEndPoint.patients.add(patient);
		}
	}

	@RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
	public void delete(@PathVariable int id) {
		final Patient patient = find(id);
		if (patient != null) {
			PatientEndPoint.patients.remove(patients.get(0));
		}
	}

	private Patient find(final int id) {
		final List<Patient> patients = PatientEndPoint.patients.stream()
				.filter(p -> p.getId() == id).collect(Collectors.toList());
		if (patients.isEmpty()) {
			return null;
		} else {
			return patients.get(0);
		}
	}
}
