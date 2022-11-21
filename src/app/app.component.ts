import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Employee } from './employee';
import { EmployeeService } from './employee.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public employees: Employee[] = [];
  public editEmployee: Employee | undefined;
  public deleteEmployee!: Employee;

  constructor(private employeeService: EmployeeService) { }

  ngOnInit() {
    this.getEmployees()
  }

  public getEmployees(): void {
    this.employeeService.getEmployees().subscribe(
      (response: Employee[]) => {
        this.employees = response
        console.log(this.employees);
      }
    )
  }

  public onAddEmployee(addForm: NgForm) {
    document.getElementById('add-employee-form')?.click();
    this.employeeService.addEmployees(addForm.value).subscribe(
      (response: Employee) => {
        console.log(response);
        this.getEmployees();
        addForm.reset();
      }
    )
  }

  public onUpdateEmployee(employee: Employee) {
    console.log(employee);
    this.employeeService.updateEmployees(employee).subscribe(
      (response: Employee) => {
        console.log(response);
        this.getEmployees()
      }
    );
  }

  public onDeleteEmployee(employeeId: number) {
    this.employeeService.deleteEmployees(employeeId).subscribe(
      (response: void) => {
        this.getEmployees()
      }
    );
  }

  public searchEmployee(key: string){
    const results: Employee[] = [];
    for(const employee of this.employees){
      if(employee.name.toLowerCase().indexOf(key.toLowerCase())!== -1 || employee.email.toLowerCase().indexOf(key.toLowerCase())!== -1 || employee.phone.toLowerCase().indexOf(key.toLowerCase())!== -1 || employee.jobTitle.toLowerCase().indexOf(key.toLowerCase())!== -1){
        results.push(employee)
      }
    }
    this.employees = results
    if(results.length === 0 || !key){
      this.getEmployees()
    }
  }

  public openModal(employee: Employee, mode: string) {
    const container = document.getElementById('main-container')
    const button = document.createElement('button')
    button.type = 'button'
    button.style.display = 'none'
    button.setAttribute('data-toggle', 'modal')
    if (mode === 'add') {
      button.setAttribute('data-target', '#addEmployeeModal')
    }
    if (mode === 'edit') {
      this.editEmployee = employee
      button.setAttribute('data-target', '#updateEmployeeModal')
    }
    if (mode === 'delete') {
      this.deleteEmployee = employee;
      button.setAttribute('data-target', '#deleteEmployeeModal')
    }
    container?.appendChild(button)
    button.click();
  }

}
