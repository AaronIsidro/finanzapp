import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Divisas } from './divisas';

describe('Divisas', () => {
  let component: Divisas;
  let fixture: ComponentFixture<Divisas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Divisas],
    }).compileComponents();

    fixture = TestBed.createComponent(Divisas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
