import { Component } from '@angular/core';
import { ContatoService } from '../../services/contato.service';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../components/button/button.component';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    FormsModule
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent {
  contatos: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;

  showEditModal = false;
  selectedContact: any = {
    nome: '',
    email: '',
    celular: '',
    telefone: ''
  };

  constructor(
    private contatoService: ContatoService,
    private router: Router
  ) { }

  navigateToCadastro() {
    this.router.navigate(['/']);
  }

  ngOnInit(): void {
    this.carregarContatos();
  }

  carregarContatos(): void {
    this.contatoService.listarContatos().subscribe({
      next: (data) => {
        this.contatos = data;
        this.totalPages = Math.ceil(this.contatos.length / this.itemsPerPage);
      },
      error: (err) => console.error('Erro ao carregar contatos:', err)
    });
  }

  alternarStatusContato(id: number) {
    this.contatoService.toggleAtivo(id).subscribe({
      next: () => {
        this.carregarContatos();
      },
      error: (err) => {
        console.error('Erro ao alterar status:', err);
      }
    });
  }

  openEditModal(contato: any) {
    this.selectedContact = {
      ...contato,
    };
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
  }

  saveEditedContact() {
    const updatedContact = {
      ...this.selectedContact,
    };

    this.contatoService.atualizarContato(updatedContact).subscribe({
      next: () => {
        this.carregarContatos();
        this.closeEditModal();
      },
      error: (err) => {
        console.error('Erro ao atualizar contato:', err);
      }
    });
  }

  get paginatedContatos(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.contatos.slice(startIndex, startIndex + this.itemsPerPage);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  getMinValue(a: number, b: number): number {
    return Math.min(a, b);
  }
}