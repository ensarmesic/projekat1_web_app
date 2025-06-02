output "alb_dns_name" {
  description = "DNS name of the Application Load Balancer"
  value       = aws_lb.app_alb.dns_name
}

output "ec2_public_ip" {
  description = "Public IP address of EC2 instance"
  value       = aws_instance.app_instance.public_ip
}
