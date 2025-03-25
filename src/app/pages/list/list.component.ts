import { Component } from '@angular/core';
import { ContatoService } from '../../services/contato.service';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../components/button/button.component';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent {
  contatos: any[] = [];

  constructor(private contatoService: ContatoService) { }

  ngOnInit(): void {
    this.carregarContatos();
  }

  carregarContatos(): void {
    this.contatoService.listarContatos().subscribe({
      next: (data) => this.contatos = data,
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
}
