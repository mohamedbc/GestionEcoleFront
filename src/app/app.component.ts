import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { EtudiantService } from './etudiant.service';
import { Etudiant } from './model/Etudiant';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'GestionEcolePrive';

  public etudiants!: Etudiant[];
  public editedEtudiant!: Etudiant;
  public deletedEtudiant!: Etudiant;

  constructor(private etudiantService: EtudiantService){}
  
  ngOnInit(): void {
    this.getEtudiants();
  }

  public getEtudiants(): void{
    this.etudiantService.getEtudiants().subscribe(
      (response: Etudiant[]) => {
        this.etudiants = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }

    );
  }

  public addEtudiant(addForm: NgForm): void {
    document.getElementById('add-employee-form')!.click();
    this.etudiantService.addEtudiant(addForm.value).subscribe(
      (response: Etudiant) => {
        console.log(response);
        this.getEtudiants();
        addForm.reset();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
        addForm.reset();
      }
    );
  }

  public updateEtudiant(etudiant: Etudiant): void {
    this.etudiantService.updateEtudiant(etudiant).subscribe(
      (response: Etudiant) => {
        console.log(response);
        this.getEtudiants();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public deleteEtudiant(idEtudiant: number): void {
    this.etudiantService.deleteEtudiant(idEtudiant).subscribe(
      (response: void) => {
        console.log(response);
        this.getEtudiants();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public searchEtudiants(key: string): void {
    console.log(key);
    const results: Etudiant[] = [];
    for (const etudiant of this.etudiants) {
      if (etudiant.nom.toLowerCase().indexOf(key.toLowerCase()) !== -1
      || etudiant.adresse.toLowerCase().indexOf(key.toLowerCase()) !== -1
      || etudiant.numTel.toLowerCase().indexOf(key.toLowerCase()) !== -1
      || etudiant.dateNaissance.toLowerCase().indexOf(key.toLowerCase()) !== -1) {
        results.push(etudiant); 
      }
    }
    this.etudiants = results;
    if (results.length === 0 || !key) {
      this.getEtudiants();
    }
  }

  public onOpenModal(etudiant: Etudiant|null, mode: string): void {
    const container = document.getElementById('main-container')!;
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if (mode === 'add') {
      button.setAttribute('data-target', '#addEmployeeModal');
    }
    if (mode === 'edit') {
      this.editedEtudiant = etudiant!;
      button.setAttribute('data-target', '#updateEmployeeModal');
    }
    if (mode === 'delete') {
      this.deletedEtudiant = etudiant!;
      button.setAttribute('data-target', '#deleteEmployeeModal');
    }
    container.appendChild(button);
    button.click();
  }

}
