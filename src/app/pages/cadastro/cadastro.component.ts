import { Component } from '@angular/core';
import { InputComponent } from '../../components/input/input.component';
import { ButtonComponent } from '../../components/button/button.component';
import { Router } from '@angular/router';
import { ContatoService } from '../../services/contato.service';
import { FormsModule } from '@angular/forms';
import Toastify from 'toastify-js';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cadastro',
  imports: [
    InputComponent,
    ButtonComponent,
    FormsModule
  ],
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css']
})
export class CadastroComponent {
  nomeMaxLength: number = 100;
  emailMaxLength: number = 255;
  celularMaxLength: number = 11;
  telefoneMaxLength: number = 10;

  formData: { nome: string, email: string, celular: string, telefone: string } = {
    nome: '',
    email: '',
    celular: '',
    telefone: ''
  };

  constructor(
    private router: Router,
    private contatoService: ContatoService,
    private toastr: ToastrService
  ) { }

  navigateToList() {
    this.router.navigate(['/list']);
  }

  cadastrarContato() {
    this.contatoService.criarContato(this.formData).subscribe({
      next: (response) => {
        console.log('Contato cadastrado:', response);
        this.toastr.success('Contato salvo com sucesso!', 'Sucesso');
        this.formData = { nome: '', email: '', celular: '', telefone: '' };
      },
      error: (error) => {
        console.error('Erro:', error);
        if (error.error && error.error.message) {
          this.toastr.error(error.error.message, 'Erro');
        }
        else {
          this.toastr.error('Falha ao cadastrar contato.', 'Erro');
        }
      }
    });
  }
}